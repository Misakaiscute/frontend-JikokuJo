<script lang="ts">
    import "leaflet/dist/leaflet.css";

    import SearchContainer from "./lib/schedule/presentation/Container.svelte";
    import ProfileContainer from "./lib/profile/presentation/Container.svelte";
    import Map from "./lib/map/Map.svelte";

    import MapController from "./lib/map/mapController.svelte.ts";
    import UserController from "./lib/profile/presentation/userController.svelte.ts";

    MapController.setMapControllerContext();
    UserController.setUserControllerContext();
</script>
<main id="main" class="h-svh w-svw relative">
    <Map/>
    <div class="layout absolute top-0 left-0 p-2 h-svh w-svw pointer-events-none">
        <div class="[grid-area:nav-search]">
            <SearchContainer/>
        </div>
        <div class="[grid-area:profile]">
            <ProfileContainer/>
        </div>
    </div>
</main>
<style>
    .layout {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: calc(40px + clamp(18rem, 40svw, 450px)) auto;
        grid-template-areas:
            "nav-search profile"
    }
</style>