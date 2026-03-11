<script lang="ts">
    import "leaflet/dist/leaflet.css";

    import Map from "./lib/map/Map.svelte";
    import Container from "./lib/schedule/presentation/Container.svelte";
</script>
<main class="h-svh w-svw relative">
    <Map/>
    <Container/>
</main>