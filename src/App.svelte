<script lang="ts">
    import "leaflet/dist/leaflet.css";

    import SearchContainer from "./lib/schedule/presentation/Container.svelte";
    import ProfileContainer from "./lib/profile/presentation/Container.svelte";
    import Map from "./lib/map/presentation/Map.svelte";

    import MapController from "./lib/map/presentation/mapController.svelte.ts";
    import UserController from "./lib/profile/presentation/userController.svelte.ts";

    MapController.setMapControllerContext();
    UserController.setUserControllerContext();
</script>
<main id="main" class="h-svh w-svw relative">
    <Map/>
    <div class="layout absolute top-0 left-0 min-[600px]:p-2 h-svh w-svw pointer-events-none">
        <!--Header only shown when width is below 600px-->
        <header class="[grid-area:header] hidden px-2 bg-white">
            <h1 class="flex-[1_1_auto] text-lg">JikokuJó</h1>
            <ProfileContainer/>
        </header>
        <div class="[grid-area:nav-search]">
            <SearchContainer/>
        </div>
        <!--Hidden when we are one smaller screens, goes up into the header below 600px of width-->
        <div class="[grid-area:profile] max-[600px]:hidden">
            <ProfileContainer/>
        </div>
    </div>
</main>
<style>
    .layout {
        display: grid;
        grid-template-rows: 1fr;
        grid-template-columns: calc(80px + clamp(18rem, 40svw, 450px)) auto;
        grid-template-areas:
            "nav-search profile";
    }
    @media(max-width: 600px){
        .layout {
            grid-template-rows: 3.5rem auto;
            grid-template-columns: calc(40px + clamp(18rem, 40svw, 450px)) auto;
            grid-template-areas:
                "header header"
                "nav-search nav-search";
        }
        .layout > header {
            display: flex;
            align-items: center;
            justify-content: space-around;
        }
    }
</style>