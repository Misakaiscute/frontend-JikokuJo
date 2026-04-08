<script lang="ts">
    import MapController from "./mapController.svelte.ts";
    import {fade} from "svelte/transition";
    import {onMount, tick} from "svelte";

    let mapElement: HTMLDivElement;
    const mapController: MapController = MapController.getMapControllerContext();

    onMount(() => {
        tick();
        mapController.bindMap(mapElement);
    });
</script>
<div bind:this={mapElement} class="z-0 absolute w-svw h-svh left-0 top-0"></div>
{#if mapController.isTripLoading}
    <div transition:fade={{duration: 100}} class="z-0 absolute h-svh w-svw left-0 top-0 flex flex-col justify-center items-center bg-zinc-900/80">
        <span class="loader w-[10svw] aspect-square mb-4"></span>
        <p class="text-white text-2xl">Utazás megjelenítése</p>
    </div>
{/if}