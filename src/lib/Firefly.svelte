<script>
import { onMount } from 'svelte';
import { fade,scale } from 'svelte/transition';

export let  w=100;
export let  h=100;

let x = Math.random()*w;
let y = Math.random()*h;
let ang = Math.random()*2*Math.PI;
let v = 1;

function move(){
    x += v*Math.cos(ang);
    y += v*Math.sin(ang);
    ang += Math.random()*20*Math.PI/180-10*Math.PI/180;

    if (x<-10 || x>2*w+10)  x = Math.random()*w;
    if (y<-10 || y>h+10)  y = Math.random()*h;    
  }

  onMount(() => {
    
        x = Math.random()*w;
        y = Math.random()*h;
		const interval = setInterval(() => {
			move()
		}, 100);
		//If a function is returned from onMount, it will be called when the component is unmounted.
		return () => clearInterval(interval);
	});

</script>


<div class="ff"  style="top:{y}px;left:{x}px;" ></div>

<style>
.ff{
    position: absolute;
    filter: blur(2px);
    background-color: #fddba3;
    height: 5px;
    width: 5px;
    border-radius: 50%;
   
}

</style>