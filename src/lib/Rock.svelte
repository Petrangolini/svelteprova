<script lang="ts">
import { fade,scale } from 'svelte/transition';

 let s=100;

 let x=Math.floor(Math.random()*80)+5;
 let y=Math.floor(Math.random()*100)+20;
 export let f=100;

</script>

<div class="roccia" in:fade={{delay:f}} style="width:{s}px; height:{s}px; top:-{y}%; left:{x}%;opacity:0;">
    
</div>

<style>
    .roccia{
        position: absolute;
        background-image: url('./rock.png');
        background-size: cover;
        animation: fadeOut2 1s;
    }

    @keyframes fadeOut2 {
        50% {opacity:1;}
        100% {transform: translateY(120vh);opacity: 0.3;}
    }


</style>