<script lang="ts">

    import { onMount,onDestroy } from "svelte";
    import 'iconify-icon';
    import Dice from '$lib/Dice.svelte';
    import Monster from "$lib/Monster.svelte";
    import { Confetti } from "svelte-confetti";
    import { fade,scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import Rock from "$lib/Rock.svelte";


    let damage=false;
    let destroy=false;
    let frana=false;

    let dialog:HTMLDialogElement;
    let mute=false;

    let audiofile:{dice:HTMLAudioElement|null,hurt:HTMLAudioElement|null,coin:HTMLAudioElement|null,heart:HTMLAudioElement|null,monster:HTMLAudioElement|null,soundtruck:HTMLAudioElement|null,crush:HTMLAudioElement|null,rockslide:HTMLAudioElement|null}={            
                dice:null,
                hurt:null,
                coin:null,
                heart:null,
                monster:null,
                soundtruck:null,
                rockslide:null,
                crush:null
            } 
    let monete=0
    let targetMonete=16
    let vita=12
    let maxvita=12
    let descrizioni="";
    let azioni="Enter";
    let aspetta=false;

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
    let story=`You are visiting Ancient Ruins, ruins are fragile, pay attention and move careful, every time you roll a 6 you lose 1❤️  `;

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

                audiofile.hurt.volume=0.3;
                audiofile.hurt.play();
                damage=true;
                vita=vita-d;  
                await new Promise(resolve => setTimeout(resolve, 1200));
            }else{
                destroy=true;
                monete=monete+showEnemy.gld;
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
         },
         Win:()=>{},
         Lose:()=>{}

    }

    

    const typeInc={
        None:'None',
        Trap:'Trap',
        Creature:'Creature'
    } 
    let showEnemy:{nome:string,hit:number,image:string,dmg:number,gld:number, type:any,}={nome:'',hit:0,image:'',dmg:0,gld:0,type:typeInc.None};

          

    let feed=[
        {
            nome:'Pit Trap',
            image: 'game-icons:spiky-pit',
            hit:0,
            dmg:3,
            gld:0,
            type:typeInc.Trap,
            action:[]
        },
        {
            nome:'Sketelon',
            image: 'game-icons:piece-skull',
            hit:2,
            dmg:2,
            gld:1,
            type:typeInc.Creature,
            action:[]
        },
        {
            nome:'Goblin',
            image: 'game-icons:goblin-head',
            hit:3,
            dmg:2,
            gld:2,
            type:typeInc.Creature,
            action:[]
        },
        {
            nome:'Haunting',
            image: 'game-icons:spectre',
            hit:5,
            dmg:2,
            gld:4,
            type:typeInc.Creature,
            action:[]
        },
        {
            nome:'Ogre',
            image: 'game-icons:ogre',
            hit:4,
            dmg:4,
            gld:7,
            type:typeInc.Creature,
            action:[]
        },
        {
            nome:'Orc',
            image: 'game-icons:orc-head',
            hit:4,
            dmg:5,
            gld:8,
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
        decsription:"Avoid trap, once"
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
        decsription:"Flee foe once"
       },
       {
        nome:"Shiled",
        image:'solar:shield-bold-duotone',
        price:3,
        condition:()=>game==gamephases.Damage && showEnemy.type==typeInc.Creature,
        effect:()=>{monete=monete-3; mercato[2].buyed=true},
        using:()=>{  
            audiofile.crush.play();
            mercato[2].buyed=false;
            showEnemy={nome:'',hit:0,image:'',dmg:0,gld:0,type:typeInc.None};
            dice=0;
            destroy=false;
            damage=false;
            
            azioni="Explore";

            game=gamephases.Rest;
          },
        buyed:false,
        decsription:"Avoid damage once"
       },
       {
        nome:"Potion",
        image:'game-icons:health-potion',
        price:4,
        condition:()=>{return gamephases.Rest},
        effect:()=>{monete=monete-4; mercato[3].buyed=true;},
        using:()=>{ vita=vita+6>maxvita?maxvita:vita+6;  mercato[3].buyed=false;  },
        buyed:false,
        decsription:"Healt D6 HP"
       },
       {
        nome:"Sword",
        image:'vaadin:sword',
        price:5,
        condition:()=>true,
        effect:()=>{monete=monete-5; mercato[4].buyed=true},
        using:()=>{},
        buyed:false,
        decsription:"+1 to defeat foe"
       },
       {
        nome:"Armor",
        image:'game-icons:armor-vest',
        price:10,
        condition:()=>true,
        effect:()=>{monete=monete-10; mercato[5].buyed=true},
        using:()=>{},
        buyed:false,
        decsription:"-1 DMG"
       }
    ]

    
    function playAudio(audio:any){
        return new Promise(res=>{
                audio.play()
            audio.onended = res
                })
}

    onMount(async()=>{
        


    })
    onDestroy(()=>{
        
            audiofile.soundtruck?.pause();
    })

    function selezione(en:any){ 
        //showEnemy=en;
    }
    async function nextaction(){

        if (audiofile.soundtruck?.loop==false){
                
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

        if (dice==6)  {
            audiofile.rockslide?.play();
            frana=true;
            await infliggiDanni(1);
        } 

        frana=false;

    }
    function disabilita(item:any):boolean{
        //console.log(item.nome+" "+!(item.buyed && item.condition()));
        return !(item.buyed && item.condition());
    }
	function aggiorna(){
        mercato=[...mercato];
    }
    async function infliggiDanni(v:number){
        
        audiofile.hurt?.play();
        damage=true;
        vita=vita-v;  
        await new Promise(resolve => setTimeout(resolve, 600));
            
        if (vita<=0) game=gamephases.Lose;

        damage=false;
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
{#if frana}
    {#each {length: 20} as _,i }
        <Rock f={200*i}></Rock>
    {/each}
{/if}
    <nav>
        <div class="titolo">ANCIENT RUINS</div>
    
    </nav>
    
    <div class="body">
        
        <audio bind:this={audiofile.dice} src="/audio/dice.wav"></audio>
        <audio bind:this={audiofile.hurt} src="/audio/hurt.wav"></audio>
        <audio bind:this={audiofile.coin} src="/audio/coin.wav"></audio>
        <audio bind:this={audiofile.heart} src="/audio/heartbeat.wav"></audio>
        <audio bind:this={audiofile.monster} src="/audio/monster.wav"></audio>
        <audio bind:this={audiofile.soundtruck} src="/audio/carmack.mp3"></audio>
        <audio bind:this={audiofile.crush} src="/audio/crush.wav"></audio>
        <audio bind:this={audiofile.rockslide} src="/audio/rockslide.wav"></audio>

    <div class="arena">

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
                    
                    <iconify-icon class="cuore" icon="noto:anatomical-heart" style="font-size: 40px;"></iconify-icon>:
                    {#key vita}
                    <span in:scale={{ duration: 2000}} >{vita}</span>                        
                    {/key}
                    
                    
                </div>
                <div class="dati_info">
                    <iconify-icon class="moneta" icon="twemoji:coin" style="font-size: 40px;"></iconify-icon>:
                    {#key monete}
                    <span in:scale={{ duration: 2000}}>{monete}</span>
                    {/key}
                    /{targetMonete}
                    
                </div>
            </div>        

        <div class="azioni">
                
        {#each mercato as item, index }
            <button disabled="{ disabilita(item)}" class:comprato="{item.buyed}" on:click={()=>{item.using()}} >
                <iconify-icon icon="{mercato[index].image}" class="icon_item"></iconify-icon>
                
            </button>

        {/each}
        
        </div>
    
        {#if showEnemy.nome.length>0}
            <Monster showEnemy={showEnemy} ></Monster>
        {:else if (game==gamephases.Rest)}
                <div class="mercato2" in:fade={{ delay: 250, duration: 1000 }}>
                    <h1 class="titlem2">Merchant</h1>
                    {#each mercato as item, index }
                    <button class="cont" on:click={item.effect} disabled="{!(monete>=item.price && !item.buyed && gamephases.Rest ) }" on:mouseenter={()=>{descrizioni=item.decsription}} on:mouseleave={()=>{descrizioni=""}}>
                        <div class="c1">
                            <div style="display:flex;">
                                <iconify-icon icon="{item.image}" style="font-size: 55px;"></iconify-icon>
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

                <div class='story' in:fade >Excape from ancient ruins with your money. You are alive and can live one day more</div>
                <a data-sveltekit-preload-data="off" href="/" ><button class="back">Return Home</button></a>
    
        {:else if (game==gamephases.Lose)}
    
                <div class='story' style="text-align:center; ont-size: 5rem; margin-top: 8rem;" in:fade>YOU DIED</div>
                <a data-sveltekit-preload-data="off" href="/" ><button class="back">Return Home</button></a>
    


        {:else if game==gamephases.Explore}
        <div class="dungeon" in:fade={{ delay: 250, duration: 1000 }}>
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


<button on:click={nextaction}  disabled="{aspetta}" class="next-action">{azioni}</button>

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
      @property --x {
    syntax: '<percentage>';
    inherits: false;
    initial-value: 0%;
  }
  
@keyframes colorChange {
  0% {
    --x:0%;
  }
  50% {
    --x:50%;
  }
  100% {
    --x:100%;
  }
}
    audio{
        display:none;
    }

    .back{
        background-color: yellow;
        font-family: doom;
        width:100%;
        border-radius: 10px;
        font-size: 1.8rem;
    }
    .newhtml{
        width: 100%;
        height: 100svh;
        background-color: rgb(223, 248, 33);
        margin:0px;
        padding:0px;
        background-image:   radial-gradient(ellipse at var(--x) 20%, white 3%, transparent 50%,black 100%);
        animation: colorChange 40s infinite alternate;
        overflow: hidden;
    }
     .area{
        margin-inline: 5%;
        background-image: url('/bg/ancient-ruins.svg');
        background-size: 100% 80%;
        background-position-y: 40%;
        background-repeat: no-repeat;
        overflow: initial;
        overflow: hidden;
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
        background-color: rgba(223, 248, 33,0.6);
    }
    .titolo{
        text-align: center;
        font-size: 3em;
        font-family: doom;
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
    }
    
    .story{
        color:black;
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
            font-size: 2rem;
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