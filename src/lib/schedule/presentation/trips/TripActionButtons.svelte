<script lang="ts">
    import { fade } from "svelte/transition";
    import TripSelectionController from "../tripSelectionController.svelte.ts";
    import MapController from "../../../map/presentation/mapController.svelte.ts";
    import UserController from "../../../profile/presentation/userController.svelte.ts";
    import type {Favourite} from "../../../profile/data/model/favourite.ts";

    const tripSelectionController: TripSelectionController = TripSelectionController.getTripSelectionControllerContext();
    const mapController: MapController = MapController.getMapControllerContext();
    const userController: UserController = UserController.getUserControllerContext();

    $effect(() => {
        userController.isLoggedIn.then(() => {
            userController.getFavourites();
        }).catch(() => {})
    });
    
    let lastKnownTrackRealtimeState: boolean = false;
    let isCurrectTripTracked: boolean = $derived.by(() => {
        const result: boolean = mapController.realtimeVehicle !== null

        if (tripSelectionController.selectedTrip !== null) lastKnownTrackRealtimeState = result;
        return lastKnownTrackRealtimeState;
    });

    let lastKnownFavouriteState: boolean = false;
    let isCurrentTripFavourite: boolean = $derived.by(() => {
        const result: boolean = userController.favourites?.some((fav: Favourite) => {
            return fav.route.id === tripSelectionController.selectedTrip?.route_id &&
                +fav.time === +tripSelectionController.selectedTrip?.stops[0].arrival_time;
        }) ?? false;

        if (tripSelectionController.selectedTrip !== null) lastKnownFavouriteState = result;
        return lastKnownFavouriteState;
    });

    const onCopyLinkToClipboard = (): void => {
        navigator.clipboard.writeText(window.location.href);
    }
    const onTrackInRealtimeBtnClick = (): void => {
        if (mapController.realtimeVehicle === null){
            userController.isLoggedIn.then(async () => {
                await tripSelectionController.openBroadcasting().then(() => {
                    mapController.registerListenerForVehiclePositionUpdate(tripSelectionController.selectedTrip!!);
                });
            });
        } else {
            mapController.unregisterListenerForVehiclePositionUpdate(tripSelectionController.selectedTrip!!);
        }
    }
    const onFavouriteBtnClick = (): void => {
        const time: number = tripSelectionController.selectedTrip!!.stops[0].arrival_time;
        const routeId: string = tripSelectionController.selectedTrip!!.route_id;
        userController.toggleFavourite(routeId, time);
    }
</script>

{#snippet copyButton()}
    <div id="share-btn" role="button" tabindex="-1"
        class="flex-[0_0_30px] flex justify-center items-center w-full bg-white border-2 rounded-sm border-zinc-200
             hover:border-zinc-800 hover:cursor-pointer transition-colors duration-200 pointer-events-auto"
        onclick={onCopyLinkToClipboard} onkeydown={() => {}}
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_75%] aspect-square" width="24" height="24" viewBox="0 0 24 24">
            <rect width="14" height="14" x="8" y="2" fill="currentColor" rx="2" ry="2" />
            <path fill="currentColor" d="M8.5 18A2.5 2.5 0 0 1 6 15.5V8H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-2z" />
        </svg>
    </div>
{/snippet}
{#snippet realtimeVehicleButton()}
    {#snippet trackingOn()}
        <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_75%] aspect-square" width="16" height="16" viewBox="0 0 16 16">
            <path fill="currentColor" d="M1.147 1.315a.5.5 0 0 1 .707 0l13 13a.5.5 0 0 1-.707.708L8.113 8.989Q8.058 9 8 9a1 1 0 0 1-1-1q.001-.059.01-.114L5.853 6.729a2.5 2.5 0 0 0 .382 3.039a.75.75 0 0 1-1.06 1.06a4 4 0 0 1-.405-5.182L3.698 4.574a5.5 5.5 0 0 0 .412 7.315a.75.75 0 0 1-1.06 1.06a7 7 0 0 1-.417-9.44L1.147 2.022a.5.5 0 0 1 0-.707M11.889 3.05a.75.75 0 0 1 1.06 0a7 7 0 0 1 .878 8.825l-1.087-1.087a5.5 5.5 0 0 0-.851-6.677a.75.75 0 0 1 0-1.061M9.77 5.172a.75.75 0 0 1 1.06 0a4 4 0 0 1 .802 4.509L10.45 8.499a2.5 2.5 0 0 0-.68-2.267a.75.75 0 0 1 0-1.06" />
        </svg>
    {/snippet}
    {#snippet trackingOff()}
        <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_75%] aspect-square" width="16" height="16" viewBox="0 0 16 16">
            <path fill="currentColor" d="M3.05 3.05a.75.75 0 0 1 1.06 1.06a5.5 5.5 0 0 0 0 7.778a.75.75 0 0 1-1.06 1.06a7 7 0 0 1 0-9.9m8.838 0a.75.75 0 0 1 1.06 0a7 7 0 0 1 0 9.9a.75.75 0 1 1-1.06-1.061a5.5 5.5 0 0 0 0-7.778a.75.75 0 0 1 0-1.061M5.174 5.172a.75.75 0 1 1 1.06 1.06a2.5 2.5 0 0 0 0 3.536a.75.75 0 0 1-1.06 1.06a4 4 0 0 1 0-5.656m4.596 0a.75.75 0 0 1 1.06 0a4 4 0 0 1 0 5.656a.75.75 0 1 1-1.06-1.06a2.5 2.5 0 0 0 0-3.535a.75.75 0 0 1 0-1.061M8 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2" />
        </svg>
    {/snippet}

    {#await userController.isLoggedIn then _}
        <div id="track-realtime-btn" role="button" tabindex="-1"
            class="flex-[0_0_30px] flex justify-center items-center w-full bg-white border-2 rounded-sm border-zinc-200
                hover:border-zinc-800 hover:cursor-pointer transition-colors duration-200 pointer-events-auto"
            onclick={onTrackInRealtimeBtnClick} onkeydown={() => {}}
        >
            {#if isCurrectTripTracked}
                {@render trackingOn()}
            {:else}
                {@render trackingOff()}
            {/if}
        </div>
    {:catch _}
        <div id="track-realtime-btn" class="flex-[0_0_30px] flex justify-center items-center w-full
            bg-zinc-200 border-2 rounded-sm border-zinc-400 pointer-events-auto"
            >
            {@render trackingOff()}
        </div>
    {/await}
{/snippet}
{#snippet favouriteButton()}
    {#snippet favouriteOn()}
        <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_75%] aspect-square" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937l-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39l3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36z" />
        </svg>
    {/snippet}
    {#snippet favouriteOff()}
        <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_75%] aspect-square" width="24" height="24" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-width="2" d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597z" />
        </svg>
    {/snippet}

    {#await userController.isLoggedIn then _}
        <div id="favourite-btn" role="button" tabindex="-1"
            class="flex-[0_0_30px] flex justify-center items-center w-full bg-white border-2 rounded-sm border-zinc-200
                 hover:border-zinc-800 hover:cursor-pointer transition-colors duration-200 pointer-events-auto"
            onclick={onFavouriteBtnClick} onkeydown={() => {}}
        >
            {#if isCurrentTripFavourite}
                {@render favouriteOn()}
            {:else}
                {@render favouriteOff()}
            {/if}
        </div>
    {:catch _}
        <div id="favourite-btn" class="flex-[0_0_30px] flex justify-center items-center w-full
            bg-zinc-200 border-2 rounded-sm border-zinc-400 pointer-events-auto">
            {@render favouriteOff()}
        </div>
    {/await}
{/snippet}

{#if tripSelectionController.selectedTrip !== null}
    <div transition:fade={{ duration: 200 }}
        class="flex-[0_0_auto] w-full flex flex-col gap-y-0.5 justify-center items-center pointer-events-none">
        {@render copyButton()}
        {@render realtimeVehicleButton()}
        {@render favouriteButton()}
    </div>
{/if}