<script lang="ts">
    import 'iconify-icon'
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';
    import { quintOut } from 'svelte/easing';



    export let num:number=1;
    let audio;
    
    let n=1;
    let img:string='bi:dice-'+n;
    const incr = () => {n = (n+1)%6;}
    let clear;
    let t=0;

    onMount(()=>{
        audio=new Audio('/audio/dice.wav');
        audio.volume=0.3;
        audio.play();
    
        t=Math.floor(Math.random()*1300)+500;
        setTimeout(()=>{
            clearInterval(clear);
            n=num;},t);
        clear=setInterval(incr,80);
    })

    $: img=n<=0?'bi:dice-1':'bi:dice-'+n;
</script>


  <iconify-icon icon="{img}"  class="dado" style="font-size:80px;background:white;border-radius:20px;" ></iconify-icon>

    
<style>
.dado{
    /*animation: mymove 1s;*/  
    margin: 10px;
}
@keyframes mymove {
  100% {transform: rotate(180deg);}
}

</style>

