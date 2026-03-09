<script lang="ts">
    import "leaflet/dist/leaflet.css";

    import Map from "./lib/map/Map.svelte";
    import ScheduleSearchContainer from "./lib/schedule/presentation/ScheduleSearchContainer.svelte";
</script>
<main class="h-svh w-svw relative">
    <Map/>
    <ScheduleSearchContainer/>
</main>