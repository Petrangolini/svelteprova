<script lang="ts">

    import { onMount,onDestroy } from "svelte";
    import 'iconify-icon';
    import Dice from '$lib/Dice.svelte';
    import Monster from "$lib/Monster.svelte";
    import { Confetti } from "svelte-confetti";
    import { fade,scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Firefly from "$lib/Firefly.svelte";
    import { clickOutside } from "$lib/Clickoutside";

    let damage=false;
    let destroy=false;
    let mute=false;

    let audiofile:any;

    let monete=0
    let targetMonete=18
    let vita=15
    let maxvita=15
    let descrizioni="";
    let azioni="Enter";
    let aspetta=false;

    let dialog:HTMLDialogElement;
    let dialogIsOpen=false;

    const gamephases = {
                Story:'Story',
                Rest:'Rest',
                Explore:'Explore',
                Precombat:'Precombat',
                Damage:'Damage',
                Win:'Win',
                Lose:'Lose'
            };
    
    let game=gamephases.Story;
    let story=`You are visiting the Putrid Swamps, a hostile place, where your equipment is always at risk. When you lose a figth you lose the most expensive item of your equipment. `;
    
    let dice=0;

    let nextfase={
        Story:async()=>{
            azioni='Explore'
            game=gamephases.Rest
        },
        Rest:async()=>{ 
            
            game=gamephases.Explore;


            await rollDice();

            audiofile.monster.volume=0.1;
            audiofile.monster.play();
            showEnemy={...feed[dice-1]};
            azioni="Fight";
            game=gamephases.Precombat;
         },
         Precombat:async()=>{
            dice=-1;
            if (showEnemy.type==typeInc.Creature){
                await rollDice();
            }


            azioni="Damage";           
            game=gamephases.Damage;
            
         },
         
         Damage:async()=>{
            if (showEnemy.hit>dice){

                let d=mercato[5].buyed?showEnemy.dmg-1:showEnemy.dmg;
                await removeElement();
                audiofile.hurt.volume=0.3;
                audiofile.hurt.play();
                damage=true;
                vita=vita-d;  
                if (showEnemy.type=typeInc.Trap) monete=monete+showEnemy.gld<0?0:monete+showEnemy.gld;

                await new Promise(resolve => setTimeout(resolve, 1200));
            }else{
                destroy=true;
                monete=monete+showEnemy.gld<0?0:monete+showEnemy.gld;
                audiofile.coin.play();
                await new Promise(resolve => setTimeout(resolve, 600));
            }

            //reset
            showEnemy={nome:'',hit:0,image:'',dmg:0,gld:0,type:typeInc.None};
            dice=0;
            destroy=false;
            damage=false;
            
            azioni="Explore";

            game=gamephases.Rest;

            
            if (monete>=targetMonete){
                azioni="Return Home";
                game=gamephases.Win;   
                aspetta=true;
            }
            else if (vita<=0){
                azioni="You Died";
                game=gamephases.Lose;
                aspetta=true;
            }
         }

    }

    

    const typeInc={
        None:'None',
        Trap:'Trap',
        Creature:'Creature'
    } 
    let showEnemy:{nome:string,hit:number,image:string,dmg:number,gld:number, type:any,}={nome:'',hit:0,image:'',dmg:0,gld:0,type:typeInc.None};

          

    let feed=[
        {
            nome:'Acid Trap',
            image: 'game-icons:acid',
            hit:0,
            dmg:2,
            gld:-4,
            type:typeInc.Trap,
            action:[]
        },
        {
            nome:'Croaker',
            image: 'game-icons:croc-jaws',
            hit:2,
            dmg:3,
            gld:0,
            type:typeInc.Creature,
            action:[]
        },
        {
            nome:'snakefolk',
            image: 'game-icons:snake-tongue',
            hit:3,
            dmg:3,
            gld:4,
            type:typeInc.Creature,
            action:[]
        },
        {
            nome:'Slime',
            image: 'game-icons:acid-blob',
            hit:4,
            dmg:1,
            gld:4,
            type:typeInc.Creature,
            action:[]
        },
        {
            nome:'Shaman',
            image: 'game-icons:tribal-mask',
            hit:4,
            dmg:3,
            gld:6,
            type:typeInc.Creature,
            action:[]
        },
        {
            nome:'Hydra',
            image: 'game-icons:hydra',
            hit:5,
            dmg:8,
            gld:12,
            type:typeInc.Creature,
            action:[]
        }
        
    ]

    let mercato=[
       {
        nome:"Rope",
        image:'game-icons:rope-coil',
        price:2,
        condition:()=>{return showEnemy.type==typeInc.Trap && game==gamephases.Precombat},
        effect:()=>{monete=monete-2; mercato[0].buyed=true; 
            //console.log("rope")
        },
        using:()=>{  
            mercato[0].buyed=false;
            showEnemy={nome:'',hit:0,image:'',dmg:0,gld:0,type:typeInc.None};
            dice=0;
            destroy=false;
            damage=false;

            
            azioni="Explore";
            game=gamephases.Rest;
          },
        buyed:false,
        decsription:"Avoid trap, once",
        destroy:false
       },
       {
        nome:"Caltrop",
        image:'game-icons:caltrops',
        price:2,
        condition:()=>{return showEnemy.type==typeInc.Creature && game==gamephases.Precombat},
        effect:()=>{monete=monete-2;   mercato[1].buyed=true},
        using:()=>{ 
            mercato[1].buyed=false; 
            showEnemy={nome:'',hit:0,image:'',dmg:0,gld:0,type:typeInc.None};
            dice=0;
            destroy=false;
            damage=false;

            
            azioni="Explore";
            game=gamephases.Rest;
         },
        buyed:false,
        decsription:"Flee foe once",
        destroy:false
       },
       {
        nome:"Shiled",
        image:'solar:shield-bold-duotone',
        price:3,
        condition:()=>game==gamephases.Damage && showEnemy.type==typeInc.Creature,
        effect:()=>{monete=monete-3; mercato[2].buyed=true},
        using:()=>{  
            mercato[2].buyed=false;
            showEnemy={nome:'',hit:0,image:'',dmg:0,gld:0,type:typeInc.None};
            dice=0;
            destroy=false;
            damage=false;
            
            azioni="Explore";

            game=gamephases.Rest;
          },
        buyed:false,
        decsription:"Avoid damage once",
        destroy:false
       },
       {
        nome:"Potion",
        image:'game-icons:health-potion',
        price:4,
        condition:()=>{return gamephases.Rest},
        effect:()=>{monete=monete-4; mercato[3].buyed=true;},
        using:()=>{ vita=vita+6>maxvita?maxvita:vita+6;  mercato[3].buyed=false;  },
        buyed:false,
        decsription:"Healt D6 HP",
        destroy:false
       },
       {
        nome:"Sword",
        image:'vaadin:sword',
        price:5,
        condition:()=>true,
        effect:()=>{monete=monete-5; mercato[4].buyed=true},
        using:()=>{},
        buyed:false,
        decsription:"+1 to defeat foe",
        destroy:false
       },
       {
        nome:"Armor",
        image:'game-icons:armor-vest',
        price:10,
        condition:()=>true,
        effect:()=>{monete=monete-10; mercato[5].buyed=true},
        using:()=>{},
        buyed:false,
        decsription:"-1 DMG",
        destroy:false
       }
    ]        



    function playAudio(audio:any){
        return new Promise(res=>{
                audio.play()
            audio.onended = res
                })
    }
    let w:number=0;
    let h:number=0;
    onMount( ()=>{
        w=window.innerWidth;
        h=window.innerHeight;
        console.log(w);
        console.log(h);
        
        audiofile={
                dice:new Audio('/audio/dice.wav'),
                hurt:new Audio('/audio/hurt.wav'),
                coin:new Audio('/audio/coin.wav'),
                heart:new Audio('/audio/heartbeat.wav'),
                monster:new Audio('/audio/monster.wav'),
                soundtruck:new Audio('/audio/carmack.mp3'),
                crush:new Audio('/audio/crush.wav')
            }

    })
    onDestroy(()=>{
        audiofile.soundtruck.pause();

    })

    function selezione(en:any){ 
        //showEnemy=en;
    }
    async function nextaction(){

        if (audiofile.soundtruck.loop==false){
                
            audiofile.soundtruck.loop=true; 
            audiofile.soundtruck.volume=0.03;
              
            audiofile.soundtruck.play();

        }
        aspetta=true;
        let t=game as keyof typeof nextfase;
           
        await nextfase[t]();
        aggiorna();
        aspetta=false;
        //console.log(game)
    }
    async function rollDice(){
        dice=0;
        await new Promise(resolve => setTimeout(resolve, 400));

        dice=Math.floor(Math.random()*6)+1;
        //audiofile.dice.play();
        await new Promise(resolve => setTimeout(resolve, 1600));
         

    }
    function disabilita(item:any):boolean{
        //console.log(item.nome+" "+!(item.buyed && item.condition()));
        return !(item.buyed && item.condition());
    }
	function aggiorna(){
        mercato=[...mercato];
    }
    async function removeElement(){
        for (let i=mercato.length-1;i>=0;i--){
            if (mercato[i].buyed) {
                mercato[i].buyed=false;
                mercato[i].destroy=true;
                mercato=[...mercato];
                
                audiofile.crush.volume=0.6;
                audiofile.crush.play();               
                await new Promise(resolve => setTimeout(resolve, 800));
                mercato[i].destroy=false;


                break;
            }
        }
    }
    
    function muta(){
        mute=!mute;
        if (mute) audiofile.soundtruck.volume=0;
        else audiofile.soundtruck.volume=0.03;
    }


function openDialog(){
    dialog.showModal();
}
function closeDialog(){
    dialog.close();
}

</script>

<div class="newhtml">
<div class="area"> 
   
    <button class="audio" on:click={muta}>
        {#if mute}
            <iconify-icon  icon="ion:volume-mute" ></iconify-icon>
        {:else}
            <iconify-icon  icon="ion:volume-high-sharp" ></iconify-icon>
        {/if}
    </button>

    <button class="sm" on:click={openDialog}>
            <iconify-icon  icon="game-icons:dungeon-gate" ></iconify-icon>
    </button>

    
{#each {length:20} as _, i}
<Firefly  w={w} h={h}></Firefly>
{/each}
    
    <nav>
        <div class="titolo">FETID SWAMP</div>
    
    </nav>
    
    <div class="body">

    <div class="arena">

        <div>
            <div style="font-size:60px;text-align:center;margin:0px;font-wigth:900;display:flex;justify-content:space-around"> 
                <div class="dati_info">
                    {#if damage}
                        <Confetti rounded
                        noGravity 
                        amount=100 
                        duration=800
                        size=16
                        x={[-1, 1]} y={[-2, 1]}
                        colorArray={["url(/blooddrop.png)"]} />
                    {/if}
                    
                    <iconify-icon class="cuore" icon="noto:anatomical-heart" style="font-size: 40px;"></iconify-icon><span style="color:yellow" >:</span>
                    {#key vita}
                    <span in:scale={{ duration: 2000}} style="color:yellow" >{vita}</span>                        
                    {/key}
                    
                    
                </div>
                <div class="dati_info">
                    <iconify-icon class="moneta" icon="twemoji:coin" style="font-size: 40px;"></iconify-icon><span style="color:yellow" >:</span>
                    {#key monete}
                    <span in:scale={{ duration: 2000}} style="color:yellow">{monete}</span>
                    {/key}
                    <span style="color:yellow">/{targetMonete}</span>

                    
                    
                </div>
            </div>        

        <div class="azioni">
                
        {#each mercato as item, index }
            <button disabled="{ disabilita(item)}" class:comprato="{item.buyed}" on:click={()=>{item.using()}} >
                <iconify-icon icon="{mercato[index].image}"  class="icon_item"></iconify-icon>
                {#if item.destroy}
                    <Confetti noGravity duration=800 size=15 x={[-0.5, 0.5]} y={[-0.5, 0.5]}  colorArray={["#777777", "#aaaaaa", "#555555", "#dddddd"]}/>
                    {/if}
            </button>


        {/each}
        
        </div>
    
        {#if showEnemy.nome.length>0}
            <Monster showEnemy={showEnemy} color="yellow"></Monster>
        {:else if (game==gamephases.Rest)}
                <div class="mercato2" in:fade={{ delay: 200, duration: 500 }}>
                    <h1 class="titlem2">Merchant</h1>
                    {#each mercato as item, index }
                    <button class="cont" on:click={item.effect} disabled="{!(monete>=item.price && !item.buyed && gamephases.Rest ) }" on:mouseenter={()=>{descrizioni=item.decsription}} on:mouseleave={()=>{descrizioni=""}}>
                        <div class="c1">
                            <div style="display:flex;">
                                <iconify-icon icon="{item.image}" style="font-size:55px" ></iconify-icon>
                                <div style="display:flex;flex-direction:column;">
                                    <span class="nome" style="width:150px; font-size:large;">{item.nome}</span>
                                    <span class="nome" style="width:150px;font-size:x-small;color:gray;">{item.decsription}</span>
                                </div>
                                
                            </div>
                            
                            <span class="gld">{item.price}</span>
                        </div>
                        
                    </button>
                    {/each}
                    
                </div>
        {:else if (game==gamephases.Story)}

            <div class='story' in:fade>{story}</div>
        {:else if (game==gamephases.Win)}

            <div class='story' in:fade >Excape from fetid swamp with your money. You are alive and can live one day more</div>
            <a data-sveltekit-preload-data="off" href="/" ><button class='back' >Return Home</button></a>

        {:else if (game==gamephases.Lose)}

            <div class='story' style="text-align:center; ont-size: 5rem; margin-top: 8rem;" in:fade>YOU DIED</div>
            <a data-sveltekit-preload-data="off" href="/" ><button class='back'>Return Home</button></a>

        {:else if game==gamephases.Explore}
        <div class="dungeon" in:fade={{ delay: 200, duration: 500 }}>
            <h1 class="titlem2">Dungeon</h1>
        {#each feed as inc,index}
        <button class="cont" on:click={()=>{selezione(inc)}} class:myactive={dice==index+1}>
            <div class="c1">
                <iconify-icon icon="{inc.image}" style="font-size: 40px; color:white;background:black;"></iconify-icon>
                
                <span class="nome" style="width:150px;">{inc.nome}</span>
                
                <span class="hit">{inc.hit}</span>
                
                <span class="dmg">{inc.dmg}</span>

                <span class="gld">{inc.gld}</span>
            </div>
            
        </button>
        {/each}

        </div>


        {/if}
        

        </div>
        
        <div class="campo">
            {#if dice>0}
            <div>
                <Dice num={dice}></Dice> 
            </div> 
            {/if}

        </div>

    </div>

</div>


<button on:click={nextaction} class="next-action"  disabled="{aspetta}">{azioni}</button>

</div>

</div>

<dialog bind:this={dialog} transition:fade  >

    <div class="dungeon" in:fade={{ delay: 200, duration: 500 }}>
        <h1 class="titlem2">Dungeon</h1>
    {#each feed as inc,index}
    <button class="cont" on:click={()=>{selezione(inc)}} class:myactive={dice==index+1}>
        <div class="c1">
            <iconify-icon icon="{inc.image}" style="font-size: 40px; color:white;background:black;"></iconify-icon>
            
            <span class="nome" style="width:150px;">{inc.nome}</span>
            
            <span class="hit">{inc.hit}</span>
            
            <span class="dmg">{inc.dmg}</span>

            <span class="gld">{inc.gld}</span>
        </div>
        
    </button>
    {/each}

    </div>


    <button on:click={closeDialog} style="width:100%;font-size:2rem;">Close</button>
</dialog>
  




<style>
    .back{
        background-color: yellow;
        font-family: doom;
        width:100%;
        border-radius: 10px;
        font-size: 1.8rem;
    }
    .newhtml{    
        width: 100%;
        background-color: rgb(0, 44, 2);
        margin:0px;
        padding:0px;
        height: 100svh;
        background-image:  linear-gradient(#017701,#032703);
        animation: none;
        overflow: hidden;
    }
    dialog{
        background-color: rgba(255,255,255,1);
    }
    .audio{
        position: absolute;
        bottom:70px;
        right: 10px;
        background-color: rgba(250,250,250, 0.6);
        border: solid black 3px;
        border-radius: 50%;
        padding:10px;
        z-index: 100;
        font-size: 40px;
    }
    .sm{
        position: absolute;
        bottom:70px;
        left: 10px;
        background-color: rgba(250,250,250, 0.6);
        border: solid black 3px;
        border-radius: 50%;
        padding:10px;
        z-index: 100;
        font-size: 40px;
    }
     .area{
        margin-inline: 5%;
        background-image: url('/bg/swamp.svg');
        background-size: 100% 80%;
        background-position-y: 45%;
        background-repeat: no-repeat;
        
    }
    .cont{
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor:pointer;
    }
    .body{
        display:flex;
        gap:10px;
    }
    .c1{
        display: flex;
        justify-content: space-between;
        align-items: center;
        width:100%;
    }

    
    .nome{
        text-align: left;
    }
    .campo{
        height: 10lvh;
        display: flex;
        justify-content: center;
        gap:20px
        
    }
    .arena{
        border: solid 1px black;
        min-height: 75svh;
        width:50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 25px;
        margin:auto;
        background-color: rgba(20,20,20, 0.6);
        position: relative;
    }
    .titolo{
        text-align: center;
        font-size: 3em;
        font-family: doom;
        color:yellow
    }
    .azioni{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin:1rem;
    }
  
    .comprato{
        border: 2px solid gray;
        background-color: rgb(250, 225, 251);
        animation: bordercolor 5s infinite;
        cursor: pointer;
    }
    .myactive{
        animation: myactive 0.5s;
    }
    .mercato2, .dungeon {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    .mercato2 span,.dungeon span{
        font-size: 30px;
        margin:5px;
    }
    .titlem2{
        grid-column: 1 / span 2;
        text-align: center;
        font-family: doom;
        color:yellow;
    }
    .story{
        color:yellow;
        text-wrap:wrap;
        margin:5%;
        font-size: 2rem;
    }
    .cuore{
        animation: hearthbeat 1s infinite;
    }

    .icon_item{
        font-size: 55px;
    }
    .next-action{
        width:100%;
        margin: 10px;
        font-size: 2em;
    }
    
    @keyframes bordercolor {
        50% {border-color: lightblue;}
    }
    
   
    @keyframes hearthbeat {
        50% {transform: scale(1.4);}
    }

    
    @keyframes coinflip {
        50% {transform: rotate(360deg);}
    }

    @keyframes myactive {
        50% {background-color: rgb(156, 247, 255);}
    }
    @media screen and (max-width: 1200px) {
        .arena{
            width:90%;
        }
    }
    @media screen and (max-width: 800px) {
        .arena{
            padding: 5px;
            min-height: 80svh;
        }
        .titolo{
            margin-bottom: 0.3rem;
        }
        .dati_info{
            font-size: 40px;
            margin-block: 0.3rem;
        }
        .icon_item{
            font-size: 30px;
        }
        .mercato2, .dungeon {
            display: grid;
            grid-template-columns: 1fr;
        }
        .story{
            font-size: 1.7rem;
        }
        .azioni{
            margin:5px;
        }
        .titlem2{
            grid-column: 1;
            margin:0px;
        }
        .campo{
            height: auto;
        }
        .next-action{
            position: absolute;
            bottom: 10px;
            left: 0px;
            width:95%;
            font-size: 2em;
        }
        .audio, .sm{
            font-size: 25px;
            padding:5px;
        }
    }



</style>