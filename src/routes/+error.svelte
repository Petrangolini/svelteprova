<script>
import { goto } from '$app/navigation';
import { onMount } from 'svelte';

 // needs `throw` in v1


onMount(()=>{
    goto('/');
})
</script>