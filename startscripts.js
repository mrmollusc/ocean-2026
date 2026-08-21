const w = document.getElementById('w');
const a = document.getElementById('a');
const s = document.getElementById('s');
const d = document.getElementById('d');

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

      default:
         break;
   }
})

function toggle(){
   if(toggle_flag == true){
      togglebutton.style.background = 'red';
      toggle_flag = false;

      w.style.opacity = 0;
      a.style.display = 'block';
      s.style.display = 'block';
      d.style.display = 'block';

      return;
   }
   if(toggle_flag == false){
      togglebutton.style.background = 'green';
      toggle_flag = true;

      w.style.opacity = 1;
      a.style.display = 'none';
      s.style.display = 'none';
      d.style.display = 'none';

      return;
   }
   
}