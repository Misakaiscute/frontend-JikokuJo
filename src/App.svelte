<script lang="ts">
    import "leaflet/dist/leaflet.css";

    import Map from "./lib/map/Map.svelte";
    import SearchBar from "./lib/schedule/presentation/SearchBar.svelte";
</script>
<main class="h-svh w-svw relative">
    <Map/>
    <SearchBar/>
</main>