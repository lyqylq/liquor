
function initCmp(config) {
	var div = document.getElementById(config.domId);
	
	var table = $('<table id="table_'+config.domId+'"></table>'); //创建一个表格
	table.attr('class', config.tableCls);
	
	var headerDom = renderHeader(config);//表头
	var bodyDom = renderTbody(config);//数据
	
	
	table.append(headerDom)
	table.append(bodyDom);
	//table.append(footerDom);
	table.appendTo(div);
	
/*	$("#total-page").text(config.totalPage);
	$("#pageNo").val(config.currentPage);*/
}
//表格头部
function renderHeader(config){
	var columnModels = config.columnModel;//索引与数据关系如 {dataIndex:id,header:姓名}
	//表头创建-start
	var headerTh = $("<thead></thead>");//表头
	var headerTr = $("<tr></tr>");//表头行
	for (var i = 0; i < columnModels.length; i++) {
		headerTr.append("<td>" + columnModels[i].header + "</td>")
	}
	headerTh.append(headerTr);//表头完整
	return headerTh;
	//表头完整
}

//数据表格
function renderTbody(config){
	var dataTbody = $('<tbody id="body_'+config.domId+'"></tbody>');//表中数据
	return dataTbody;
}
//表格底端
function renderFooter(config){
	var footerTr = $('<tr></tr>');//页脚
	footerTr.attr('class', config.footerCls);
	footerTr
			.append("<td class='footer-table' colspan='9'>"
					+ "<span id='previous_"+config.domId+"' class='previous'>上一页</span>"
					+ "<input type='text' id='pageNo_"+config.domId+"'  class='page-num' value='1'>"
					+ "<span id='jump_"+config.domId+"' class='jump' >跳转</span>"
					+ "<span id='next_"+config.domId+"' class='next' >下一页</span>"
					+ "<span class='total-page'>共<span id='totalPage_"+config.domId+"'>0</span>页</span>"
					+ "</td>");
	return footerTr;
}
/**
 * 下一页
 * @param config
 */
function nextPage(config){
	if((config.currentPage+1) <= config.totalPage){
		config.paramData.pageNo = config.currentPage+1;
		paginationData(config);
	}else
		alert("已经最后一页了！");
}
/**
 * 上一页
 * @param config
 */
function prePage(config){
	if((config.currentPage-1) > 0){
		config.paramData.pageNo = config.currentPage-1;
		paginationData(config);
	}else
		alert("已经第一页了！");
}
/**
 * 指定页
 * @param config
 */
function jumpPage(config){
	if($("#pageNo_"+config.domId).val()){
		var pageNo = Number($("#pageNo_"+config.domId).val());
		if(pageNo){
			if(0 < pageNo && pageNo <= config.totalPage){
				config.paramData.pageNo = pageNo;
				paginationData(config);
			}else{
				alert("超过了总页数！")
			}
		}else{
			alert("请输入正确的页码！")
		}
	}
}

/**
 * 调用方式
 *  var url ='<%=basePath %>/normalLoanManagerController/findUsrOrderInfoList';
	var config = {
		domId : "aaa",//渲染到的div
		columnModel : [{dataIndex : "applyCode",header:"订单编号"},//渲染出来那些字段和名字
						{dataIndex : "userName",header:"姓名"},
						{dataIndex : "creatTime",header:"申请时间"},
						{dataIndex : "lendingTime",header:"放款时间"},
						{dataIndex : "applyAmount",header:"放款金额"}],
		tableCls : "table table-condensed table-bordered table-hover orderList",//表格的样式
		paramData : {//请求参数
				applyTime:$("#applyTime").val(),
				loanTime:$("#loanTime").val(),
				isOverLimit:$("input[name='overLimit']:checked").val(),
				pageSize : 5,
				pageNo:$("#pageNo").val()==0?1:$("#pageNo").val(),
				data:new Date()
			},
		url : url
	};
	paginationData(config);
	
	$(".btn1").click(function(){
		paginationData(config);//绑定到一个button
	});
 * @param config
 */
//分页列表
function paginationData(config) {
	$("#table_"+config.domId).remove(); //移除第一行以外的所以行
	initCmp(config);
	$.ajax({
		type : config.type == null ? "get" : config.type,
		dataType : "json",
		contentType : "application/json;charset=UTF-8",
		async : true,
		url : config.url,
		data : config.paramData,
		success : function(re) {
			if (!re.success) {
				alert(re.msg);
			} else {
				var obj = re.obj;
				
				var list = obj.list;
				if (list != undefined) {
					var str = "";
					for (var i = 0; i < list.length; i++) {
						str += "<tr>";
						var index = config.columnModel;
						for (var j = 0; j < index.length; j++) {
							str += "<td>"
									+ nullToNbsp(list[i][index[j].dataIndex])
									+ "</td>";
						}
						str += "</tr>";
					}
					$("#body_"+config.domId).append(str);
					var footerDom = renderFooter(config);//底部
					$("#body_"+config.domId).append(footerDom);
					$("#totalPage_"+config.domId).text(obj.totalPage);
					$("#pageNo_"+config.domId).val(obj.pageNo);
					config.currentPage = obj.pageNo;
					config.totalPage = obj.totalPage;
					$("#previous_"+config.domId).click(function(){
						prePage(config);
					});
					$("#jump_"+config.domId).click(function(){
						jumpPage(config);
					});
					$("#next_"+config.domId).click(function(){
						nextPage(config);
					});
				}
			}
		}
	});
}
