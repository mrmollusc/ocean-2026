const w = document.getElementById('w');
const a = document.getElementById('a');
const s = document.getElementById('s');
const d = document.getElementById('d');

const wa = document.getElementById('wa');
const aa = document.getElementById('aa');
const sa = document.getElementById('sa');
const da = document.getElementById('da');

const space = document.getElementById('space');
const k = document.getElementById('k');
const o = document.getElementById('o');
const togglebutton = document.getElementById('toggle')

let toggle_flag = true;

addEventListener('keydown',(e) =>{
   const keycode = e.key;
   switch (keycode) {
      case 'w':
         w.style.color = 'red';
         break;
      
      case 'a':
         a.style.color = 'red'
         break;

      case 's':
         s.style.color = 'red'
         break;
         
      case 'd':
         d.style.color = 'red'
         break; 

      case ' ':
         space.style.color = 'red'
         break;   

      case 'k':
         k.style.color = 'red'
         break; 
         
      case 'o':
         o.style.color = 'red'
         break;
         
      case 'ArrowUp':
         wa.style.color = 'red'
         break;

      case 'ArrowDown':
         sa.style.color = 'red'
         break;
      
      case 'ArrowLeft':
         aa.style.color = 'red'
         break;
      
      case 'ArrowRight':
         da.style.color = 'red'
         break;

      default:
         break;
   }
});

addEventListener('keyup',(e)=>{
   const keycode = e.key;
   switch (keycode) {
      case 'w':
         w.style.color = 'black';
         break;
      
      case 'a':
         a.style.color = 'black'
         break;

      case 's':
         s.style.color = 'black'
         break;
         
      case 'd':
         d.style.color = 'black'
         break; 

      case ' ':
         space.style.color = 'black'
         break;   

      case 'k':
         k.style.color = 'black'
         break; 
         
      case 'o':
         o.style.color = 'black'
         break;

      case 'ArrowUp':
         wa.style.color = 'black'
         break;

      case 'ArrowDown':
         sa.style.color = 'black'
         break;
      
      case 'ArrowLeft':
         aa.style.color = 'black'
         break;
      
      case 'ArrowRight':
         da.style.color = 'black'
         break;

      default:
         break;
   }
})

function toggle(){
   if(toggle_flag == true){
      togglebutton.style.background = 'red';
      toggle_flag = false;

      w.style.opacity = 0;
      a.style.opacity = 0;
      s.style.opacity = 0;
      d.style.opacity = 0;
      k.style.opacity = 0;
      o.style.opacity = 0;

      wa.style.opacity = 1;
      aa.style.opacity = 1;
      sa.style.opacity = 1;
      da.style.opacity = 1;


      return;
   }
   if(toggle_flag == false){
      togglebutton.style.background = 'green';
      toggle_flag = true;

      w.style.opacity = 1;
      a.style.opacity = 1;
      s.style.opacity = 1;
      d.style.opacity = 1;
      k.style.opacity = 1;
      o.style.opacity = 1;

      wa.style.opacity = 0;
      aa.style.opacity = 0;
      sa.style.opacity = 0;
      da.style.opacity = 0;


      return;
   }
   
}