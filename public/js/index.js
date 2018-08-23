$(function(){
	//设置cookie=========================================
	function setCookie(cname,cvalue,exdays){
	    var d = new Date();
	    d.setTime(d.getTime()+(exdays*24*60*60*1000));
	    var expires = "expires="+d.toGMTString();
	    document.cookie = cname+"="+cvalue+"; "+expires;
	}
	
	//定义登录表单的全局变量=================================
	var $Username=$("#username");
	var $Password=$("#password");
	
	//注册=================================================
	$("#register_btn").click(function(){
		$.ajax({
			type:"post",
			url:"http://127.0.0.1:8080/api/register",
			async:true,
			data:{"username":$Username.val(),"password":$Password.val()},
			success:function(res){
				var data=JSON.parse(res);
				if(data.code==0){
					$("#msg1").html("用户名已存在，请重新注册！");
					$("#msg1").fadeIn();
					var timer=setTimeout(function(){
						clearTimeout(timer);
						$("#msg1").fadeOut()
					},2000);
					$Username.val("");
					$Password.val("");
				}else if(data.code==1){
					$("#msg1").html("恭喜"+data.username+"，注册成功！");
				}
			}
		});
	});
	
	//登录===================================================
	$("#login_btn").click(function(){
		$.ajax({
			type:"post",
			url:"http://127.0.0.1:8080/api/login",
			async:true,
			data:{"username":$Username.val(),"password":$Password.val()},
			success:function(res){
				var data=JSON.parse(res);
				if(data.code==0){
					$("#msg1").html("用户名不存在，请注册！");
					$("#msg1").fadeIn();
					var timer=setTimeout(function(){
						clearTimeout(timer);
						$("#msg1").fadeOut()
					},2000);
				}else{
					setCookie("username",data.username,30);
					setCookie("Avatorurl",data.Avatorurl,30);
					UpdateInfos();
				}
			}
		});
	});
	
	//退出==================================================
	$("#logout").click(function(){
		var username=getcookie("username");
		setCookie("username",username,-30);
		UpdateInfos();
	});
	
	//发表留言===============================================
	$("#publish").click(function(){
		var username=getcookie("username");
		var Avatorurl=getcookie("Avatorurl");
		var content=$("#area");
		var d=new Date();
		var Ptime=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
		if(username){
			if($("#area").val()){
				$.ajax({
					type:"post",
					url:"http://127.0.0.1:8080/api/publish",
					async:true,
					data:{"username":username,"Ptime":Ptime,"content":content.val(),"Avatorurl":Avatorurl},
					success:function(res){
						console.log(res);
						var data=JSON.parse(res);
						if(data.code==1){
							$("#msg2").html("留言成功");
							$("#msg2").fadeIn();
							var timer=setTimeout(function(){
								$("#msg2").fadeOut();
							},2000);
						}else{
							$("#msg2").html("留言失败");
							$("#msg2").fadeIn();
							var timer=setTimeout(function(){
								$("#msg2").fadeOut();
							},2000);
						}
						content.val("");
					}
				});
			}else{
				$("#msg2").html("提交内容不能为空！");
				$("#msg2").fadeIn();
				var timer=setTimeout(function(){
					$("#msg2").fadeOut();
				},2000);
			}
		}else{
			$("#msg2").html("请登录发表留言！");
				$("#msg2").fadeIn();
				var timer=setTimeout(function(){
					$("#msg2").fadeOut();
				},2000)
		}
//		window.location=window.location;
	});
	
	//更换头像===============================================
	$("#upload").click(function(){
		$('#Cavator').modal('hide');
		window.location=window.location;
	});
	
	var username;
	$("#change_ava").click(function(){
		username=getcookie("username");
		console.log(username);
		if(username){
			$('#Cavator').modal('show');
			$.ajax({
				type:"post",
				url:"http://127.0.0.1:8080/api/photo",
				async:true,
				data:{"username":username},
				success:function(res){
					console.log(res);
				}
			});
		}else{
			console.log("请先登录用户！")
		}
	});
		
	
	$("#photo").change(function(){
		var $file = $(this);
        var fileObj = $file[0];
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        var $img = $("#preview");
        if (fileObj && fileObj.files && fileObj.files[0]) {
            dataURL = windowURL.createObjectURL(fileObj.files[0]);
            $img.attr('src', dataURL);
        }else{
        	dataURL = $file.val();
        }
	});
	
	//支持===================================================
	$(".support").click(function(){
		$(this).html(parseInt($(this).html())+1)
		var OthersId=$(this).parents(".media").attr("tabindex");
		$.ajax({
			type:"post",
			url:"http://127.0.0.1:8080/api/support",
			async:true,
			data:{"OthersId":OthersId},
			success:function(res){
				console.log(res);
			}
		});
		
	});
	
	//反对=====================================================
	$(".unlike").click(function(){
		$(this).html(parseInt($(this).html())+1)
		var OthersId=$(this).parents(".media").attr("tabindex");
		$.ajax({
			type:"post",
			url:"http://127.0.0.1:8080/api/unlike",
			async:true,
			data:{"OthersId":OthersId},
			success:function(res){
				console.log(res);
			}
		});
		
	});
	
	//喜欢=====================================================
	$(".like").click(function(){
		$(this).html(parseInt($(this).html())+1)
		var OthersId=$(this).parents(".media").attr("tabindex");
		$.ajax({
			type:"post",
			url:"http://127.0.0.1:8080/api/like",
			async:true,
			data:{"OthersId":OthersId},
			success:function(res){
				console.log(res);
			}
		});
	});
	
	//评论=====================================================
	var commentId;
	var _this;
	$(".res").click(function(){
		var username=getcookie("username");
		_this=$(this);
		commentId=$(this).parents(".media").attr("tabindex");
		if(username){
			$('#liuyan').modal('show');
		}else{
			$('#prompt').modal('show');
		}
	});
	
	//评论登录提示框
	$("#promp_login_btn").click(function(){
		$('#prompt').modal('hide');
		$('#exampleModal').modal('show');
	});
	
	//评论
	$("#response").click(function(){
		var Avatorurl=getcookie("Avatorurl");
		var d=new Date();
		var Ptime=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
		var username=getcookie("username");
		var reswords=$("#reswords");
		if(reswords.val()){
			$.ajax({
				type:"post",
				url:"http://127.0.0.1:8080/api/res",
				async:true,
				data:{"OthersId":commentId,"username":username,"Avatorurl":Avatorurl,"publishtime":Ptime,"content":reswords.val(),"support":0,"unlike":0,"like":0},
				success:function(res){
//					console.log(res);
					reswords.val("");
					$('#liuyan').modal('hide');	
					console.log(_this.parents(".media").find("b").html());
					var resNum=parseInt(_this.parents(".media").find("b").html())+1;
					
					_this.parents(".media").find("b").html(resNum);
				}
			});
		}else{
			$("#msg3").fadeIn();
			var timer=setTimeout(function(){
				$("#msg3").fadeOut();
			},2000);
		}
	});
	
	$("#person_publish").click(function(){
		var Avatorurl=getcookie("Avatorurl");
		var d=new Date();
		var Ptime=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
		var username=getcookie("username");
		var personArea=$("#person_area");
		var OthersId=personArea.attr("tabindex");
		if(username){
			if($(personArea).val()){
				$.ajax({
					type:"post",
					url:"http://127.0.0.1:8080/api/res",
					async:true,
					data:{"OthersId":OthersId,"username":username,"Avatorurl":Avatorurl,"publishtime":Ptime,"content":personArea.val(),"support":0,"unlike":0,"like":0},
					success:function(res){
						var d=res;
						if(res){
							$("#msg4").html("评论成功！")
							$("#msg4").fadeIn();
							var timer=setTimeout(function(){
								$("#msg4").fadeOut();
							},2000);
						}
						window.location=window.location;
					}
				});
			}else{
				$("#msg4").html("评论内容不能为空！")
				$("#msg4").fadeIn();
				var timer=setTimeout(function(){
					$("#msg4").fadeOut();
				},2000);
			}
		}else{
			$("#msg4").html("请登录再发表评论")
			$("#msg4").fadeIn();
			var timer=setTimeout(function(){
				$("#msg4").fadeOut();
			},2000);
		}
		personArea.val("");
	});
	
	//回复=====================================================
	$(".huifu").click(function(){
		var OthersId=$(this).parents(".media").attr("tabindex");
//		console.log(OthersId);
		$.ajax({
			type:"get",
			url:"http://127.0.0.1:8080",
			async:true,
			data:{"OthersId":OthersId},
			success:function(res){
//				console.log(res);
			}
		});
	});
	
	//获取cookie=============================================
	function getcookie(key){
		var cookie=document.cookie;
		var arr=cookie.split("; ");
		for(var i=0;i<arr.length;i++){
			var arr2=arr[i].split("=");
			if(arr2[0]==key){
				return arr2[1];
			}
		}
	}
	
	//初始化信息面板==========================================
	function UpdateInfos(){
		var username=getcookie("username");
		var Avatorurl=getcookie("Avatorurl");
		if(username){//登录中
			$("#login_groups").hide();
			$("#myname").html(username+"的信息");
			$("#nav_avator").attr("src",Avatorurl);
			$("#login_list").show();
			$('#exampleModal').modal('hide');
		}else{
			$("#login_groups").show();
			$("#myname").html("我的信息");
			$("#login_list").hide();
		}
	}
	UpdateInfos();
});
