<script lang="ts">

    import { onMount,onDestroy,beforeUpdate } from "svelte";

onMount(()=>{
    console.log("Ciao bello");
});

    

</script>

<div class="dis">

        <a data-sveltekit-preload-data="off" href="/ruins">
            <div class="ruin">    
            </div>
        </a>
    
        <a data-sveltekit-preload-data="off" href="/catacomb">
            <div class="catacomb">
            </div>
        </a>
    <a data-sveltekit-preload-data="off" href="/swamp">
        <div class="swamp">
        </div>    
    </a>
    
    <a data-sveltekit-preload-data="off" href="/castle">
        <div class="castle">
        </div>
    </a>
    
    <h1>KORD LORD</h1>
    
</div>

<style>
    

    .dis{
        height: 99svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        position: relative;
        overflow: hidden;
    }
    h1{
        font-size: 8rem;
        font-family: madness;
        text-shadow: 5px 5px #ffffff;
    }
    @keyframes muovi{
        50% {font-size: 7rem;}
    }

    .ruin{
        position: absolute;
        top:5%;
        left:5%;
        width: 200px;
        height: 200px;
        background-image: url('/bg/ancient-ruins.svg');
        background-size: cover;
        cursor: pointer;
        box-shadow: 0 4px 5px rgba(0,0,0,0.2);
        transition: box-shadow 0.3s ease-in-out;
        background-color: #ffffff;
        border-radius: 10px;
    }
    .ruin:hover{
        box-shadow: 0 5px 15px rgba(0,0,0,0.7);
    }

    .catacomb{
        position: absolute;
        top:5%;
        right:5%;
        width: 200px;
        height: 200px;
        background-image: url('/bg/crypt.svg');
        background-size: cover;
        cursor: pointer;
        box-shadow: 0 4px 5px rgba(255, 255, 255, 0.2);
        transition: box-shadow 0.3s ease-in-out;
        background-color: #000000;
        border-radius: 10px;
    }
    .catacomb:hover{
        box-shadow: 0 5px 15px rgba(0,0,0,0.7);
    }

    .swamp{
        position: absolute;
        bottom:5%;
        left:5%;
        width: 200px;
        height: 200px;
        background-image: url('/bg/swamp.svg');
        background-size: cover;
        cursor: pointer;
        box-shadow: 0 4px 5px rgba(0, 0, 0, 0.15);
        transition: box-shadow 0.3s ease-in-out;
        background-color: #197714;
        border-radius: 10px;
    }
    .swamp:hover{
        box-shadow: 0 5px 15px rgba(0,0,0,0.7);
    }
    .castle{
        position: absolute;
        bottom:5%;
        right:5%;
        width: 200px;
        height: 200px;
        background-image: url('/bg/castle.svg');
        background-size: cover;
        cursor: pointer;
        box-shadow: 0 4px 5px rgba(0,0,0,0.15);
        transition: box-shadow 0.3s ease-in-out;
        background-color: #a5a5a5;
        border-radius: 10px;
    }
    .castle:hover{
        box-shadow: 0 5px 15px rgba(0,0,0,0.7);
    }

    @media screen and (max-width: 900px) {
        .ruin{
        position: absolute;
        top:2%;
        left:2%;
        width: 170px;
        height: 170px;
    }
    .catacomb{
        position: absolute;
        top:2%;
        right:2%;
        width: 170px;
        height: 170px;
    }
    .swamp{
        position: absolute;
        bottom:2%;
        left:2%;
        width: 170px;
        height: 170px;
    }
    .castle{
        position: absolute;
        bottom:2%;
        right:2%;
        width: 170px;
        height: 170px;
    }

    }

</style>