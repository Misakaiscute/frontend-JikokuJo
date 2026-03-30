<script lang="ts">
    import "leaflet/dist/leaflet.css";

    import SearchContainer from "./lib/schedule/presentation/Container.svelte";
    import Map from "./lib/map/Map.svelte";

    import MapController from "./lib/map/mapController.svelte.ts";

    MapController.setMapControllerContext();
</script>
<main id="main" class="h-svh w-svw relative">
    <Map/>
    <SearchContainer/>
</main>