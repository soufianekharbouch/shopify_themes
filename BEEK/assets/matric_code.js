var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
canvas.width=screen.width;
canvas.height=480;
var centerX = screen.width/2;
var centerY = 246;
var radius = 230;
var nump=6
function Point(x, y) { 
  this.x = x;
  this.y = y;
}
function insertText(text,theta,x,y,fsize,fweight){
  
 var x1 = centerX+(Math.cos(theta)*radius/1.35);
 var y1 = centerY+(Math.sin(theta)*radius/1.35);
context.font=fsize+"px Avenir Next";
//context.font="20px ";
context.fillStyle= "#4a5761";
//context.fillText(text,x1+x,y1+y);			
context.closePath(); 
}
function circle(x,y){
 context.arc(x, y, 2.5, 0, 2 * Math.PI);
 context.fillStyle= "black";
 context.fill();
 context.closePath();
}

function arcs(start,end,side,per,diff){

     var r=radius/per
     context.beginPath();               
     var x0 = centerX+(Math.cos(start)*r);
     if(side=="left")
     var x0 = centerX-(Math.cos(start)*r);
     var y0 = centerY+(Math.sin(start)*r);
     
     var x3 = centerX+(Math.cos(end)*r);
     if(side=="left")
     var x3 = centerX-(Math.cos(end)*r);
     var y3 = centerY+(Math.sin(end)*r);
     
     var r=radius/(per-1)
     start=start-Math.PI/diff
     var x1 = centerX+(Math.cos(start)*r);
     if(side=="left")
     var x1 = centerX-(Math.cos(start)*r);
     var y1 = centerY+(Math.sin(start)*r);
     
    end=end+Math.PI/diff
    var x2 = centerX+(Math.cos(end)*r);
     if(side=="left")
     var x2 = centerX-(Math.cos(end)*r);
     var y2 = centerY+(Math.sin(end)*r);
     
    context.moveTo(x0, y0);
    context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    context.strokeStyle= "black";
    context.stroke();
    context.closePath();
}

   function mini_arcs(start,end,side,per,diff){
     var r=radius/per
     context.beginPath();               
     var x0 = centerX+(Math.cos(start)*r);
     if(side=="left")
     var x0 = centerX-(Math.cos(start)*r);
     var y0 = centerY+(Math.sin(start)*r);
     
     var x3 = centerX+(Math.cos(end)*r);
     if(side=="left")
     var x3 = centerX-(Math.cos(end)*r);
     var y3 = centerY+(Math.sin(end)*r);
     
     var r=radius/per+10
     start=start-Math.PI/diff
     var x1 = centerX+(Math.cos(start)*r);
     if(side=="left")
     var x1 = centerX-(Math.cos(start)*r);
     var y1 = centerY+(Math.sin(start)*r);
     
    end=end+Math.PI/16
    var x2 = centerX+(Math.cos(end)*r);
     if(side=="left")
     var x2 = centerX-(Math.cos(end)*r);
     var y2 = centerY+(Math.sin(end)*r);
     
    context.moveTo(x0, y0);
    context.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    context.strokeStyle= "gray";
    context.stroke();
    context.closePath();
}


function get_point(theta,point,color,side){
     var r=radius/1.48
     var devider=9.5
     context.beginPath();               
     var x1 = centerX+(Math.cos(theta)*r);
     if(side=="left")
     var x1 = centerX-(Math.cos(theta)*r);
     var y1 = centerY+(Math.sin(theta)*r);
     context.moveTo(centerX, centerY);
     context.lineTo(x1,y1)
     context.strokeStyle=color;
     //context.stroke();
     context.closePath();
     var x1 = centerX+(Math.cos(theta)*r/devider*point);
     var y1 = centerY+(Math.sin(theta)*r/devider*point);
     if(side=="left")
     var x1 = centerX-(Math.cos(theta)*r/devider*point);
     circle(x1,y1)
     return {x:x1,y:y1};
}

function get_line(theta,side){
     var r=radius/2.2
     context.beginPath();               
     var x1 = centerX+(Math.cos(theta)*r);
     if(side=="left")
     var x1 = centerX-(Math.cos(theta)*r);
     var y1 = centerY+(Math.sin(theta)*r);
     context.moveTo(centerX, centerY);
     context.lineTo(x1,y1)
     context.strokeStyle="gray";
     context.stroke();
     context.closePath();
     return {x:x1,y:y1};
}


   function getMatric(skinBiom,wrinkles,texture,hydration,darkSpots,redness){
    $("#myCanvas").css({display:'block'}); 
      context.clearRect(0, 0, canvas.width, canvas.height);
    
     context.strokeStyle="black";
     //context.stroke();
     
     function get_points(){
     var numberSize=20;
     var fontSize=13;
     var numberWeight=500;
     var fontWeight=200;
     //SkinBiome
      var p=get_point(-Math.PI/2,skinBiom/10,"blue","")
      p1x=p.x; p1y=p.y
      insertText(skinBiom,-Math.PI/2,-10,-8,numberSize,numberWeight);
      insertText("Skin Biome",-Math.PI/2,-30,-28,fontSize,fontWeight);
      
      
     // Wrinkles
      var p=get_point(-Math.PI/6,wrinkles/10,"red","")
      p2x=p.x; p2y=p.y
      insertText(wrinkles,-Math.PI/6,-22,-20,numberSize,numberWeight);
      insertText("Wrinkles",-Math.PI/6,-35,-40,fontSize,fontWeight);
      
      //Texture
      var p=get_point(Math.PI/6,texture/10,"black","")
      p3x=p.x; p3y=p.y
      insertText(texture,Math.PI/6,-15,55,numberSize,numberWeight);
      insertText("Texture",Math.PI/6,-26,35,fontSize,fontWeight);
      
     //Hydration
      var p=get_point(Math.PI/2,hydration/10,"orange","")
      p4x=p.x; p4y=p.y
      insertText(hydration,Math.PI/2,-6,35,numberSize,numberWeight);
      insertText("Hydration",Math.PI/2,-25,15,fontSize,fontWeight);
      
      //DarkSpots
      var p=get_point(Math.PI/6,darkSpots/10,"green","left") 
      p5x=p.x; p5y=p.y
       insertText(darkSpots,-7*Math.PI/6,-10,55,numberSize,numberWeight);
       insertText("Dark Spots",-7*Math.PI/6,-32,35,fontSize,fontWeight);
      
      
      //redness 
      var p=get_point(-Math.PI/6,redness/10,"orchid","left")
      p6x=p.x; p6y=p.y
      insertText(redness,-5*Math.PI/6,0,-20,numberSize,numberWeight);
      insertText("Redness",-5*Math.PI/6,-14,-40,fontSize,fontWeight);
      }	

     get_points();

     //Yollew Area
     context.beginPath();
     context.moveTo(p1x,p1y);
     context.lineTo(p2x,p2y);
     context.lineTo(p3x,p3y);
     context.lineTo(p4x,p4y);
     context.lineTo(p5x,p5y);
     context.lineTo(p6x,p6y);
     context.lineTo(p1x,p1y);
     context.fillStyle = "#FFE100";
     context.fill();
     context.closePath();
     
      get_points();
      
      var par11=2.15;
      var par22=16;
      arcs(0,-Math.PI/3,"",par11,par22)
      arcs(-Math.PI/3,-2*Math.PI/3,"",par11,par22)
      arcs(-2*Math.PI/3,-3*Math.PI/3,"",par11,par22)
      arcs(-3*Math.PI/3,-4*Math.PI/3,"",par11,par22)
      arcs(-4*Math.PI/3,-5*Math.PI/3,"",par11,par22)
      arcs(-5*Math.PI/3,-6*Math.PI/3,"",par11,par22)
      
      
      var par1=10;
      var par2=13;
      var par3=1.79;
      var par4=1.62;
      var par5=33;
      var par6=17;
      mini_arcs(0-Math.PI/par5,-Math.PI/3+Math.PI/par5,"",par3,par1)  
      mini_arcs(0-Math.PI/par6,-Math.PI/3+Math.PI/par6,"",par4,par2)
      
      mini_arcs(-Math.PI/3-Math.PI/par5,-2*Math.PI/3+Math.PI/par5,"",par3,par1)
      mini_arcs(-Math.PI/3-Math.PI/par6,-2*Math.PI/3+Math.PI/par6,"",par4,par2)
      
      mini_arcs(-2*Math.PI/3-Math.PI/par5,-3*Math.PI/3+Math.PI/par5,"",par3,par1)
      mini_arcs(-2*Math.PI/3-Math.PI/par6,-3*Math.PI/3+Math.PI/par6,"",par4,par2)
      
        mini_arcs(-3*Math.PI/3-Math.PI/par5,-4*Math.PI/3+Math.PI/par5,"",par3,par1)
      mini_arcs(-3*Math.PI/3-Math.PI/par6,-4*Math.PI/3+Math.PI/par6,"",par4,par2)
      
        mini_arcs(-4*Math.PI/3-Math.PI/par5,-5*Math.PI/3+Math.PI/par5,"",par3,par1)
      mini_arcs(-4*Math.PI/3-Math.PI/par6,-5*Math.PI/3+Math.PI/par6,"",par4,par2)
      
        mini_arcs(-5*Math.PI/3-Math.PI/par5,-6*Math.PI/3+Math.PI/par5,"",par3,par1)
      mini_arcs(-5*Math.PI/3-Math.PI/par6,-6*Math.PI/3+Math.PI/par6,"",par4,par2)
       


      get_line(0,"");
      get_line(-2*(Math.PI/6),"");
      get_line(-2*(Math.PI/6),"left");
      get_line(2*Math.PI,"left");
      get_line(2*(Math.PI/6),"");
      get_line(2*(Math.PI/6),"left");
      
      
    //Circles
     for (var i=0; i< radius/2;i++){
        context.beginPath();
        context.arc(centerX,centerY, i, 0, 2 * Math.PI, false);
        context.strokeStyle = "gray";
        context.stroke();
        i=i+(radius/16)+1;
    }
    $('.ResultContainer').css({display:"block"});
    $('.ResultContainer').offset({ top : $('#myCanvas').position().top});
    $('.ResultContainer').height(0);
    $(".SkinBiom").css({left: Number($('#myCanvas').width()*0.5)-60+"px",top:"30px"})
    $('.SkinBiom').find('.ResultNumber').html(skinBiom);

    $(".Wrinkless").css({left: Number(centerX+radius/2)-45+"px",top:"96px"})
    $('.Wrinkless').find('.ResultNumber').html(wrinkles);

    $(".Texture").css({left:  Number(centerX+radius/2)-45+"px",top:"360px"})
    $('.Texture').find('.ResultNumber').html(texture);

    $(".Hydration").css({left: Number($('#myCanvas').width()*0.5)-60+"px",top:"420px"})
    $('.Hydration').find('.ResultNumber').html(hydration);

    $(".DarkSpots").css({left:  Number(centerX-radius/2)-80+"px",top:"360px"})
    $('.DarkSpots').find('.ResultNumber').html(darkSpots);

    $(".Redness").css({left: Number(centerX-radius/2)-80+"px",top:"96px"})
    $('.Redness').find('.ResultNumber').html(redness);
}
