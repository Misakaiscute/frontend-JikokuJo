<script lang="ts">
    import Map from "./map.svelte.ts";
    import {onMount} from "svelte";

    let mapElement: HTMLDivElement;

    onMount(() => {
        const map = new Map(mapElement);
    });
</script>
<div bind:this={mapElement} class="z-0 h-svh w-screen min-w-svw top-0 left-0"></div>