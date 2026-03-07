<script lang="ts">
    import Map from "./map.svelte.ts";
    import {onMount} from "svelte";

    let mapElement: HTMLDivElement;

    onMount(() => {
        const map = new Map(mapElement);
    });
</script>
<div bind:this={mapElement} class="h-svh w-svw"></div>