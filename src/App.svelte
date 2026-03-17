<script lang="ts">
    import "leaflet/dist/leaflet.css";

    import SearchContainer from "./lib/schedule/presentation/Container.svelte";

    import MapController from "./lib/map/mapController.svelte.ts";
    import {onMount, tick} from "svelte";

    let mapElement: HTMLDivElement;
    const mapController: MapController = MapController.setMapControllerContext();

    onMount(() => {
        tick();
        mapController.bindMap(mapElement);
    });
</script>
<main id="main" class="h-svh w-svw relative">
    <!--Map-->
    <div bind:this={mapElement} class="z-0 h-svh w-svw top-0 left-0"></div>
    <SearchContainer/>
</main>