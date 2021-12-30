/* jshint esversion:6 */
let GameView = require("GameView")
let jsLotteryTrend = cc.Class({
  extends: GameView,

  properties: {
    labelTitle: cc.Label,
    labelBottpmTitle: cc.Label,
    nodeContent: cc.Node,
    labelDate: cc.Label,
    pfLayoutTrend: cc.Prefab,
    pfLayoutTrendLeft: cc.Prefab, // pfLayoutTrend 分离出来的左边头部分
    pfLayoutStatistics: cc.Prefab,
    pfLayoutDirections: cc.Prefab,

    nodeDraw: cc.Graphics,

    scrollView: cc.ScrollView,
    contentView: cc.Node,

    nodeMask: cc.Node,

    standContent: cc.Node,
    nodeheadViewContentY: cc.Node,
    nodeheadViewContentX: cc.Node,
    pfLayoutTrendTitle: cc.Prefab, //右侧顶部标题栏
    pfLayoutTrendTitleSize: cc.Prefab, //右侧顶部标题栏
    viewBottomTitle: cc.Node,
    standContentView: cc.Node,
    leftBottomHeadView: cc.Node,
  },

  // LIFE-CYCLE CALLBACKS:

  ctor() {
    this.nCountList = [24, 48, 72, 96];
    this.aryDateList = ["24", "48", "72", "96"];
    this.awardsNum = [6, 2, 3, 3];
    this.jsonDateList = {};
    this.nDateIndex = 0;
    this.nTrendType = 0;
    this.jsonRetData = jsLotteryTrend.jsonRetData;
    this.NoMissingDataActive = true;
    this.WithPolylineActive = false;
  },

  onLoad() {
    // cc.systemEvent.on(EVENT_LIST.TREND_BROKEN_LINE_REFRESH, this.OnEventRefresh, this);
    // // cc.systemEvent.on( EVENT_LIST.TREND_BROKEN_WIDTH_REFRESH, this.OnEventRefreshSv, this);

    // let jsToggleHelp = this.node.getComponent("jsToggleHelp");
    // jsToggleHelp.OnSetFntColor(Fnt_Color.Select, Fnt_Color.Normal);
    // jsToggleHelp.OnTogBtnCallback = this.OnToggleEvent.bind(this);
    // this.aryDateList1 = [];
    // for (let index = 0; index < this.aryDateList.length; index++) {
    //   let mRichText = window.mfConfig.OnGetDescByKey("LobbyScene.pfLotteryTrend.Tip28")
    //   this.aryDateList1[index] = cc.js.formatStr(mRichText, this.aryDateList[index]);
    // }

    // this.OnSetPeriodSelectionDate();
  },

  update() {
    if (this.scrollView && this.isChange) {
      if (!this.scrollView.isScrolling()) {
        this.scrollView.horizontal = true
        this.scrollView.vertical = true
      }
      if (!this.scrollView.isScrolling() && !this.scrollView.isAutoScrolling()) {
        this.isChange = false
        let curOffset = this.scrollView.getScrollOffset();
        this.lastOffsetX = Math.abs(curOffset.x)
        this.lastOffsetY = Math.abs(curOffset.y)
        // console.log("zk scrollView stop```",this.lastOffsetX, " y:",this.lastOffsetY);
      }
    }
  },

  onEnterAnimEnd () {
    this.OnSearchEvent();
    jsLotteryTrend.__isInit = true;
  },

  start () {
    
    this._super()

    let jsToggleHelp = this.node.getComponent("jsToggleHelp");
    jsToggleHelp.OnSetFntColor(Fnt_Color.Select, Fnt_Color.Normal);
    jsToggleHelp.OnTogBtnCallback = this.OnToggleEvent.bind(this);
    this.aryDateList1 = [];
    for (let index = 0; index < this.aryDateList.length; index++) {
      let mRichText = window.mfConfig.OnGetDescByKey("LobbyScene.pfLotteryTrend.Tip28")
      this.aryDateList1[index] = cc.js.formatStr(mRichText, this.aryDateList[index]);
    }

    this.OnSetPeriodSelectionDate();

    this.OnInitView();
    this.keyMark = ["firstprize", "twoend", "threeend", "threefront"];
    this.awardsNum = [6, 4, 3, 3];
    this.lastOffsetX = 0;
    this.lastOffsetY = 0;
    this.isChange = false
    this.viewBottomTitle.active = false
    // this.OnInitView();
  },

  onDestroy(){
    jsLotteryTrend.__isInit = false;
    let ss = 44
  },

  onEnable(){

    cc.systemEvent.on(EVENT_LIST.TREND_BROKEN_LINE_REFRESH, this.OnEventRefresh, this);
    // cc.systemEvent.on( EVENT_LIST.TREND_BROKEN_WIDTH_REFRESH, this.OnEventRefreshSv, this);
  },

  onDisable(){
    this._super()
    cc.systemEvent.removeAll(this);
  },

  OnScrollViewScrol(v, p, f) {

    let sv = v
    let curOffset = sv.getScrollOffset();
    // console.log("zk scrollView: maxOffsetX= ",maxOffset.x," maxOffsetY= ",maxOffset.y);
    // console.log("zk scrollView: curOffsetY= ",curOffset.y);
    let oY = Math.abs(Math.abs(curOffset.y) - this.lastOffsetY)
    let oX = Math.abs(Math.abs(curOffset.x) - this.lastOffsetX)
    if (oX > oY) {
      sv.horizontal = true
      sv.vertical = false
    } else if (curOffset.x != 0 && curOffset.y != 0) {
      sv.horizontal = false
      sv.vertical = true
    }

    if (!this.scrollView.isScrolling()) {
      this.lastOffsetX = Math.abs(curOffset.x)
      this.lastOffsetY = Math.abs(curOffset.y)
    }
    this.isChange = true
  },

  OnInitView() {
    let mRichText = window.mfConfig.OnGetDescByKey("LobbyScene.pfLotteryTrend.Tip0");
    if (this.nTrendType == 0) {
      this.labelTitle.string = cc.js.formatStr(mRichText, window.mfConfig.OnGetDescByKey("LobbyScene.pfLotteryTrend.Btn1"));
    } else if (this.nTrendType == 1) {
      this.labelTitle.string = cc.js.formatStr(mRichText, window.mfConfig.OnGetDescByKey("LobbyScene.pfLotteryTrend.Btn2"));
    }
  },

  // 初始化数据
  OnGetPerioDate() {
    let mRichText = window.mfConfig.OnGetDescByKey("LobbyScene.pfLotteryTrend.Tip28")
    return cc.js.formatStr(mRichText, this.aryDateList[this.nDateIndex]);
  },

  // 设置选中的期数
  OnSetPeriodSelectionDate() {
    let strDateID = this.OnGetPerioDate();
    if (this.labelDate) this.labelDate.string = strDateID;
    // this.OnSearchEvent();
  },

  OnEventRefresh() {
    cc.systemEvent.emit(EVENT_LIST.TREND_OMISSION_DATA, this);
    cc.systemEvent.emit(EVENT_LIST.TREND_BROKEN_LINE, this);
  },

  //********************************点击事件********************************/
  // 单选切换查询数据
  OnToggleEvent(togSender, cbCustomdata) {
    let self = this;
    let nIndex = parseInt(cbCustomdata);
    let nodeTogSender = togSender.target;
    this.nTrendType = nIndex;
    this.nodeMask.active = true;
    this.scheduleOnce(this.onHiddenMask, 2);

    this.scheduleOnce(() => {
      self.OnInitView();
      self.updateData();
    }, 0.1)
  },

  OnCheckboxEvent(togSender, cbCustomData) {
    let nodeTogSender = togSender.target;
    let nToggle = nodeTogSender.getComponent(cc.Toggle);
    if (cbCustomData == 1) {
      this.NoMissingDataActive = !nToggle.isChecked;
    } else if (cbCustomData == 3) {
      this.WithPolylineActive = nToggle.isChecked;
    }
    this.OnEventRefresh();
  },

  OnClickSortBtnEvent() {
    if (this.jsLayoutTrendLeft) {
      this.jsLayoutTrendLeft.OnTrendEvent()
    }
    if (this.jsLayoutTrend) {
      this.jsLayoutTrend.OnTrendEvent()
    }
  },

  OnEventRefreshSv() {
    // 设置滑动的宽度
    this.nodeContent.width = this.jsLayoutTrend.getItselfNodeWidth();
    this.nodeContent.getComponent(cc.Layout).updateLayout();
  },

  OnBtnSelectDate() {
    let self = this;
    ManagerHelp_ShowBottomSelect(PromptTips.BottomSelect.PeriodSelectionList, this.aryDateList1, function (nIndex) {
      self.nDateIndex = nIndex;
      self.OnSetPeriodSelectionDate();
      
      let strDateID = self.OnGetPerioDate();
      if (self.labelDate) self.labelDate.string = strDateID;
      self.OnSearchEvent();
    }, self.nDateIndex);
  },

  // 清除定时器
  onclearTimer() {
    this.unschedule(this.onHiddenMask);
  },
  //隐藏MAsk
  onHiddenMask() {
    this.nodeMask.active = false;
  },

  // 搜索点击事件
  OnSearchEvent(togSender, cbCustomData) {
    let count = this.nCountList[this.nDateIndex];
    let self = this;
    let jsonParams = new CMD_WEB.LotteryTrend.OnGetPeriodRewardList_Req();
    jsonParams.count = count;
    this.nodeMask.active = true;


    // let lastUpdateTime = 0
    ManagerHelp_SetWaitLockLayer(WAIT_OPENED);
    
    this.scheduleOnce(this.onHiddenMask, 2);
    HttpHelper.PostJSONReq(GetProject().szGetTicketrewardInfoUrl, jsonParams, function (bSucceed, jsonRetData) {
      console.log("jsLotteryTrend ===> bSucceed:", bSucceed, "   jsonRetData:", jsonRetData);
      ManagerHelp_SetWaitLockLayer(WAIT_CLOSED);
      if (bSucceed) {
        self.onclearTimer();
        self.jsonRetData = jsonRetData;
        jsLotteryTrend.jsonRetData = jsonRetData
        // lastUpdateTime = Date.now();
        // console.log("lastUpdateTime:", lastUpdateTime);
        self.updateData();
        // lastUpdateTime = Date.now();
        // console.log("lastUpdateTime:", lastUpdateTime);
      }else{
        self.onclearTimer();
        self.nodeMask.active = false;
      }
    });
  },

  /** 统计遗漏数据未开次数 */
  OnAnalysisHistoryData() {
    if (!this.jsonRetData) return;
    this.aryTotalStatistics = [];
    let listdata = this.jsonRetData[CMD_WEB.LotteryTrend.OnGetPeriodRewardList_Ret.listdata].concat();
	
    let keyMark = [CMD_WEB.LotteryTrend.OnGetPeriodRewardListData_Ret.firstprize,
    CMD_WEB.LotteryTrend.OnGetPeriodRewardListData_Ret.twoend];

    while (listdata.length > 0) {
      let stRecordData = listdata.pop();
      let num = stRecordData[keyMark[0,1]];
      let numArr = num.split('');
      let jsonTempList = [];

      for (let i = 0; i < numArr.length; i++) {
        let cbCard = numArr[i];
        jsonTempList[i] = !jsonTempList[i] ? [] : jsonTempList[i];
        let aryCards = [];
		
	
        for (let j = 0; j < 10; j++) {
          let m = this.aryTotalStatistics.length;
          let dwCount = 0;
          if (m > 0) {
            dwCount = this.aryTotalStatistics[0][i][j];
            if (!dwCount) dwCount = 0;
          }
          aryCards[j] = cbCard == j ? 0 : dwCount + 1;
        }
        jsonTempList[i] = aryCards;
      }

      this.aryTotalStatistics.unshift(jsonTempList);
    }

    // console.log("this.aryTotalStatistics:", this.aryTotalStatistics);
  },

  updateData() {
    let self = this;
    this.OnAnalysisHistoryData();
    this.nodeContent.removeAllChildren();
    if (this.pfLayoutTrendLeftView) {
      this.pfLayoutTrendLeftView.removeFromParent(true);
    }
    this.nodeheadViewContentY.removeAllChildren();
    this.standContentView.active = false
    this.viewBottomTitle.active = false
    this.leftBottomHeadView.active = false
    // this.viewBottomTitle.zIndex  = 98
    // this.leftBottomHeadView.zIndex  = 99
    //scrollView 还原offset
    // this.scrollView.scrollToTopLeft(0);
    // this.scrollView.scrollToOffset( cc.v2(0, 0), 0)
    // let pos = this.nodeContent.getPosition()

    if (!this.jsonRetData) return;
    let dt = 0
    let gap = 0.01
    this.scheduleOnce(() => {
      // 01
      //顶部标题栏
      this.OnInitTopHeadView();
    }, dt)

    dt += gap
    //02 //走势左侧
    this.scheduleOnce(() => {
      this.pfLayoutTrendLeftView = cc.instantiate(this.pfLayoutTrendLeft);
      this.nodeheadViewContentX.addChild(this.pfLayoutTrendLeftView);
      // this.pfLayoutTrendLeftView.zIndex  = 1
      this.jsLayoutTrendLeft = this.pfLayoutTrendLeftView.getComponent("jsLayoutTrendLeft");
      this.jsLayoutTrendLeft.OnInitData(this.jsonRetData, this.nTrendType, this.aryTotalStatistics);
    }, dt)

    dt += gap
    this.scheduleOnce(() => {
      //03 走势右侧
      this.pfLayoutTrend = cc.instantiate(this.pfLayoutTrend);
      this.nodeContent.addChild(this.pfLayoutTrend);
      this.jsLayoutTrend = this.pfLayoutTrend.getComponent("jsLayoutTrend");
      this.jsLayoutTrend.OnInitData(this.jsonRetData, this.nTrendType, this.aryTotalStatistics);
      // 设置滑动的宽度
      this.nodeContent.width = this.jsLayoutTrend.getItselfNodeWidth();
      this.nodeContent.getComponent(cc.Layout).updateLayout();

    }, dt)



    dt += gap
    this.scheduleOnce(() => {
      let mRichText = window.mfConfig.OnGetDescByKey("LobbyScene.pfLotteryTrend.Tip5");
      if (this.nTrendType == 0) {
        let str = cc.js.formatStr(mRichText, window.mfConfig.OnGetDescByKey("LobbyScene.pfLotteryTrend.Btn1"))
        this.labelBottpmTitle.string = str;
      } else if (this.nTrendType == 1) {
        this.labelBottpmTitle.string = cc.js.formatStr(mRichText, window.mfConfig.OnGetDescByKey("LobbyScene.pfLotteryTrend.Btn2"));
      }
    }, dt)

    dt += gap
    this.scheduleOnce(() => {
      //05 统计
      this.pfLayoutStatistics = cc.instantiate(this.pfLayoutStatistics);
      this.nodeContent.addChild(this.pfLayoutStatistics);
      let jsLayoutStatistics = this.pfLayoutStatistics.getComponent("jsLayoutStatistics");
      jsLayoutStatistics.OnInitView(this.jsonRetData, this.nTrendType);
    }, dt)

    dt += gap
    this.scheduleOnce(() => {
      //06 参数说明
      this.pfLayoutDirections = cc.instantiate(this.pfLayoutDirections);
      this.nodeContent.addChild(this.pfLayoutDirections);

      let jsLayoutDirections = this.pfLayoutDirections.getComponent("jsLayoutDirections");
      jsLayoutDirections.OnInitView(this.nTrendType);
    }, dt)

    dt += gap
    this.scheduleOnce(() => {
      //07 刷新事件
      this.OnEventRefresh();
    }, dt)

    // 08更新左边顶部headview 的offset
    this.scheduleOnce(() => {
      this.scrollView.scrollToOffset(cc.v2(0, 0), 0)
      this.nodeheadViewContentX.parent.getComponent("scrollViewHead").updateOffset(this.scrollView);
      this.nodeheadViewContentY.parent.getComponent("scrollViewHead").updateOffset(this.scrollView);
      //04 坐下方左侧标题
      this.viewBottomTitle.active = true
      this.leftBottomHeadView.active = true
    }, dt)

    this.scheduleOnce(() => {
      self.nodeMask.active = false;
      self.onclearTimer();
    }, 0.5)
  },


  OnInitTopHeadView() {

    let nTrendType = this.nTrendType
    this.standContentView.active = true
    for (let index = 0; index < this.awardsNum[nTrendType]; index++) {
      let n_index = index;
      if (index % 2 == 1 && nTrendType == 1) {
        n_index = parseInt(n_index / 2);

        let pfTrendNodeRootSize = cc.instantiate(this.pfLayoutTrendTitleSize);
        this.nodeheadViewContentY.addChild(pfTrendNodeRootSize);

        let jsTrendNodeRootSIze = pfTrendNodeRootSize.getComponent("jsTrendNodeTitle");
        jsTrendNodeRootSIze.OnSetContentBg(index, n_index, 2);

      } else {
        if (index % 2 == 0 && nTrendType == 1) {
          n_index = parseInt(n_index / 2);
        }
        let pfTrendNodeRoot = cc.instantiate(this.pfLayoutTrendTitle);
        this.nodeheadViewContentY.addChild(pfTrendNodeRoot);

        let jsTrendNodeRoot = pfTrendNodeRoot.getComponent("jsTrendNodeTitle");
        jsTrendNodeRoot.OnSetContentBg(index, n_index, 1);
      }
    }
  },
});
