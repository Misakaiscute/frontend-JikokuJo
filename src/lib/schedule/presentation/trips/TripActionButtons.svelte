<script lang="ts">
    import { fade } from "svelte/transition";
    import TripSelectionController from "../tripSelectionController.svelte.ts";
    import MapController from "../../../map/presentation/mapController.svelte.ts";
    import UserController from "../../../profile/presentation/userController.svelte.ts";

    const tripSelectionController: TripSelectionController = TripSelectionController.getTripSelectionControllerContext();
    const mapController: MapController = MapController.getMapControllerContext();
    const userController: UserController = UserController.getUserControllerContext();

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
    const onCopyLinkToClipboard = (): void => {
        navigator.clipboard.writeText(window.location.href);
    }
</script>
{#if tripSelectionController.selectedTrip !== null}
    <div transition:fade={{ duration: 300 }} class="flex-[0_0_auto] w-full flex flex-col gap-y-0.5 justify-center items-center">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <div role="button" tabindex="-1"
             class="flex-[0_0_30px] flex justify-center items-center w-full bg-white border-2 rounded-sm border-zinc-200
             hover:border-zinc-800 hover:cursor-pointer transition-colors duration-200"
             onclick={onCopyLinkToClipboard}
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_75%] aspect-square" width="24" height="24" viewBox="0 0 24 24">
                <rect width="14" height="14" x="8" y="2" fill="currentColor" rx="2" ry="2" />
                <path fill="currentColor" d="M8.5 18A2.5 2.5 0 0 1 6 15.5V8H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-2z" />
            </svg>
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        {#await userController.isLoggedIn then _}
            <div role="button" tabindex="-1"
                 class="flex-[0_0_30px] flex justify-center items-center w-full bg-white border-2 rounded-sm border-zinc-200
                      hover:border-zinc-800 hover:cursor-pointer transition-colors duration-200"
                 onclick={onTrackInRealtimeBtnClick}
            >
                {#if mapController.realtimeVehicle === null}
                    <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_75%] aspect-square" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M3.05 3.05a.75.75 0 0 1 1.06 1.06a5.5 5.5 0 0 0 0 7.778a.75.75 0 0 1-1.06 1.06a7 7 0 0 1 0-9.9m8.838 0a.75.75 0 0 1 1.06 0a7 7 0 0 1 0 9.9a.75.75 0 1 1-1.06-1.061a5.5 5.5 0 0 0 0-7.778a.75.75 0 0 1 0-1.061M5.174 5.172a.75.75 0 1 1 1.06 1.06a2.5 2.5 0 0 0 0 3.536a.75.75 0 0 1-1.06 1.06a4 4 0 0 1 0-5.656m4.596 0a.75.75 0 0 1 1.06 0a4 4 0 0 1 0 5.656a.75.75 0 1 1-1.06-1.06a2.5 2.5 0 0 0 0-3.535a.75.75 0 0 1 0-1.061M8 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_75%] aspect-square" width="16" height="16" viewBox="0 0 16 16">
                        <path fill="currentColor" d="M1.147 1.315a.5.5 0 0 1 .707 0l13 13a.5.5 0 0 1-.707.708L8.113 8.989Q8.058 9 8 9a1 1 0 0 1-1-1q.001-.059.01-.114L5.853 6.729a2.5 2.5 0 0 0 .382 3.039a.75.75 0 0 1-1.06 1.06a4 4 0 0 1-.405-5.182L3.698 4.574a5.5 5.5 0 0 0 .412 7.315a.75.75 0 0 1-1.06 1.06a7 7 0 0 1-.417-9.44L1.147 2.022a.5.5 0 0 1 0-.707M11.889 3.05a.75.75 0 0 1 1.06 0a7 7 0 0 1 .878 8.825l-1.087-1.087a5.5 5.5 0 0 0-.851-6.677a.75.75 0 0 1 0-1.061M9.77 5.172a.75.75 0 0 1 1.06 0a4 4 0 0 1 .802 4.509L10.45 8.499a2.5 2.5 0 0 0-.68-2.267a.75.75 0 0 1 0-1.06" />
                    </svg>
                {/if}
            </div>
        {:catch _}
            <div class="flex-[0_0_30px] flex justify-center items-center w-full bg-zinc-200 border-2 rounded-sm border-zinc-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_75%] aspect-square" width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M3.05 3.05a.75.75 0 0 1 1.06 1.06a5.5 5.5 0 0 0 0 7.778a.75.75 0 0 1-1.06 1.06a7 7 0 0 1 0-9.9m8.838 0a.75.75 0 0 1 1.06 0a7 7 0 0 1 0 9.9a.75.75 0 1 1-1.06-1.061a5.5 5.5 0 0 0 0-7.778a.75.75 0 0 1 0-1.061M5.174 5.172a.75.75 0 1 1 1.06 1.06a2.5 2.5 0 0 0 0 3.536a.75.75 0 0 1-1.06 1.06a4 4 0 0 1 0-5.656m4.596 0a.75.75 0 0 1 1.06 0a4 4 0 0 1 0 5.656a.75.75 0 1 1-1.06-1.06a2.5 2.5 0 0 0 0-3.535a.75.75 0 0 1 0-1.061M8 7a1 1 0 1 1 0 2a1 1 0 0 1 0-2" />
                </svg>
            </div>
        {/await}
    </div>
{/if}