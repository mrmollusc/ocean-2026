export { toggle_flag, mute_flag, get_toggle_flag, get_mute_flag };

const toggle_storage_key = 'ocean-controls-toggle';
const mute_storage_key = 'ocean-controls-muted';
let toggle_flag = localStorage.getItem(toggle_storage_key) !== 'false';
let mute_flag = localStorage.getItem(mute_storage_key) === 'true';

function get_toggle_flag() {
   return localStorage.getItem(toggle_storage_key) !== 'false';
}

function get_mute_flag() {
   return localStorage.getItem(mute_storage_key) === 'true';
}
document.addEventListener('DOMContentLoaded', () => {
const animation = document.getElementById('load');
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
const ee = document.getElementById('e');
const f = document.getElementById('f');

const enter = document.getElementById('enter');
const c = document.getElementById('c');
const togglebutton = document.getElementById('toggle');
const mutebutton = document.getElementById('mute');
const wipebutton = document.getElementById('wipe');
const exists = !!w;
if (animation) {
   animation.style.opacity = '0';
   animation.style.visibility = 'hidden';
}

if (exists) {
   addEventListener('keydown', (e) => {
      const keycode = e.key;
      switch (keycode) {
         case 'w': w.style.color = 'red'; break;
         case 'a': a.style.color = 'red'; break;
         case 's': s.style.color = 'red'; break;
         case 'd': d.style.color = 'red'; break;
         case ' ': space.style.color = 'red'; break;
         case 'k': k.style.color = 'red'; break;
         case 'o': o.style.color = 'red'; break;
         case 'ArrowUp': wa.style.color = 'red'; break;
         case 'ArrowDown': sa.style.color = 'red'; break;
         case 'ArrowLeft': aa.style.color = 'red'; break;
         case 'ArrowRight': da.style.color = 'red'; break;
         case 'f': f.style.color = 'red'; break;
         case 'e': ee.style.color = 'red'; break;
         case 'c': c.style.color = 'red'; break;
         case 'Enter': enter.style.color = 'red'; break;
         default: break;
      }
   });

   addEventListener('keyup', (e) => {
      const keycode = e.key;
      switch (keycode) {
         case 'w': w.style.color = 'black'; break;
         case 'a': a.style.color = 'black'; break;
         case 's': s.style.color = 'black'; break;
         case 'd': d.style.color = 'black'; break;
         case ' ': space.style.color = 'black'; break;
         case 'k': k.style.color = 'black'; break;
         case 'o': o.style.color = 'black'; break;
         case 'ArrowUp': wa.style.color = 'black'; break;
         case 'ArrowDown': sa.style.color = 'black'; break;
         case 'ArrowLeft': aa.style.color = 'black'; break;
         case 'ArrowRight': da.style.color = 'black'; break;
         case 'f': f.style.color = 'black'; break;
         case 'e': ee.style.color = 'black'; break;
         case 'c': c.style.color = 'black'; break;
         case 'Enter': enter.style.color = 'black'; break;
         default: break;
      }
   });
}

function toggle_function() {
   if (toggle_flag == true) {
      if (togglebutton) {
         togglebutton.style.background = 'rgba(255, 0, 30, 0.6)';
         togglebutton.innerHTML = 'Arrows';
      }
      toggle_flag = false;
      localStorage.setItem(toggle_storage_key, 'false');

      if (exists) {
         w.style.opacity = 0;
         a.style.opacity = 0;
         s.style.opacity = 0;
         d.style.opacity = 0;
         k.style.opacity = 0;
         o.style.opacity = 0;
         enter.style.opacity = 0;

         wa.style.opacity = 1;
         aa.style.opacity = 1;
         sa.style.opacity = 1;
         da.style.opacity = 1;
         f.style.opacity = 1;
         e.style.opacity = 1;
         c.style.opacity = 1;
      }
      return;
   }
   if (toggle_flag == false) {
      if (togglebutton) {
         togglebutton.style.background = 'rgba(0, 255, 30, 0.6)';
         togglebutton.innerHTML = 'WASD';
      }
      toggle_flag = true;
      localStorage.setItem(toggle_storage_key, 'true');

      if (exists) {
         w.style.opacity = 1;
         a.style.opacity = 1;
         s.style.opacity = 1;
         d.style.opacity = 1;
         k.style.opacity = 1;
         o.style.opacity = 1;
         enter.style.opacity = 1;

         wa.style.opacity = 0;
         aa.style.opacity = 0;
         sa.style.opacity = 0;
         da.style.opacity = 0;
         f.style.opacity = 0;
         e.style.opacity = 0;
         c.style.opacity = 0;
      }
      return;
   }
}

function mute_function() {
   if (mute_flag == true) {
      if (mutebutton) {
         mutebutton.style.background = 'rgba(0, 255, 30, 0.6)';
         mutebutton.innerHTML = '🔈';
      }
      mute_flag = false;
      localStorage.setItem(mute_storage_key, 'false');
      return;
   }
   if (mute_flag == false) {
      if (mutebutton) {
         mutebutton.style.background = 'rgba(255, 0, 30, 0.6)';
         mutebutton.innerHTML = '🔇';
      }
      mute_flag = true;
      localStorage.setItem(mute_storage_key, 'true');
      return;
   }
}

function apply_saved_settings() {
   if (togglebutton && toggle_flag === false) {
      togglebutton.style.background = 'rgba(255, 0, 30, 0.6)';
      togglebutton.innerHTML = 'Arrows';
      if (exists) {
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
         f.style.opacity = 1;
         ee.style.opacity = 1;
         enter.style.opacity = 1;
         c.style.opacity = 0;
      }
   } else if (togglebutton) {
      togglebutton.style.background = 'rgba(0, 255, 30, 0.6)';
      togglebutton.innerHTML = 'WASD';
      if (exists) {
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
         f.style.opacity = 0;
         ee.style.opacity = 0;
         enter.style.opacity = 0;
         c.style.opacity = 1;
      }
   }

   if (mutebutton) {
      mutebutton.style.background = mute_flag
         ? 'rgba(255, 0, 30, 0.6)'
         : 'rgba(0, 255, 30, 0.6)';
      mutebutton.innerHTML = mute_flag ? '🔇' : '🔈';
   }
}

function wipe_function() {
   if (confirm('Are you sure you want to wipe your game data? Progress will be reset although customisable settings will persist.') == true) {
      localStorage.removeItem('current_room');
      localStorage.removeItem('health');
      localStorage.removeItem('player_data');
      localStorage.removeItem('player_x');
      localStorage.removeItem('player_y');
      localStorage.removeItem('room_data');
      alert('Data has been wiped! Enjoy your new game')
   }
   return;
}
togglebutton?.addEventListener('click', toggle_function);
mutebutton?.addEventListener('click', mute_function);
wipebutton?.addEventListener('click', wipe_function);

apply_saved_settings();
});