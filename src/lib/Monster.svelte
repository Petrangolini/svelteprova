<script lang="ts">
    import 'iconify-icon';
    
    import { fade,scale } from 'svelte/transition';
    import { Confetti } from "svelte-confetti";

    
    export let showEnemy:{nome:string,hit:number,image:string,dmg:number,gld:number, type:any,}={nome:'',hit:0,image:'',dmg:0,gld:0,type:''};
    export let color='blcack';
    let destroy=false;
</script>


<div class="cont2"  in:fade={{ delay: 250, duration: 300 }}>
    <div class='enemy'>
        <p class="nome" style="color:{color};">{showEnemy.nome}</p>
            <div class="elementi" style="display:flex; justify-content:center; align-items:center;color:{color};"> 
                <iconify-icon icon="ph:sword-bold" style="font-size: 30px;margin-inline:7px;"></iconify-icon>
                
                <span class="hit" >: {showEnemy.hit}  </span>

                <iconify-icon icon="game-icons:claw-slashes" style="font-size: 30px;margin-inline:7px;"></iconify-icon>

                <span class="dmg" >: {showEnemy.dmg}  </span>

                <iconify-icon icon="twemoji:coin" style="font-size:30px;margin-inline:7px;"></iconify-icon>

                <span class="gld">: {showEnemy.gld}</span>
            </div> 
                    <iconify-icon icon="{showEnemy.image}" style="font-size: 150px; color:white;background:black;margin:auto;"></iconify-icon>
                
               
    </div>            
</div>

<style>
    .enemy{
        display:flex;
        flex-direction: column;
        justify-content: center;
        min-height: 250px;
    }
    span{
        font-size: 40px;
    }
    .nome{
            font-size: 40px;
            text-align: center;
            margin: 0px;
        }
    @media screen and (max-width: 800px) {
        .enemy{
            min-height: none;
        } 
    }
</style>