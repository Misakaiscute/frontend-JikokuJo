<script lang="ts">
    import {onMount} from "svelte";

    import type {User} from "../../data/model/user.ts";
    import UserController from "../userController.svelte.ts";
    import BlackScreenOverlay from "../../../core/presentation/BlackScreenOverlay.svelte";
    import DialogHeader from "../DialogHeader.svelte";
    import FavouriteItem from "./FavouriteItem.svelte";

    const userController: UserController = UserController.getUserControllerContext();

    onMount(() => {
        userController.getFavourites();
        userController.getUser();
    });

    const onPopupClose = () => { userController.popupShown = null; }
    const onLogoutBtnClick = async () => {
        userController.attemptLogout(); 
        await userController.isLoggedIn.catch(() => {});
    }
</script>

{#snippet accountDetails(user: User)}
    <div class="flex-[0_0_auto] w-full py-1 px-4 flex gap-x-4 items-center justify-around bg-zinc-100">
        <div class="flex-[0_0_2.5rem] aspect-square rounded-full bg-zinc-200 flex items-center justify-center text-sm font-medium text-zinc-600 shrink-0">
            <p>{user.second_name[0] + user.first_name[0]}</p>
        </div>
        <div class="flex-[1_1_auto] flex flex-col justify-center items-start">
            <p class="text-sm font-medium text-zinc-900">{user.second_name} {user.first_name}</p>
            <p class="text-xs text-zinc-600 mt-0.5">{user.email}</p>
        </div>
    </div>  
{/snippet}
{#snippet favourites()}
    <div id="favourites" class="flex-[1_1_0] min-h-0 w-full pl-3 pr-1 flex flex-col overflow-y-auto">
        <p class="text-zinc-600 mb-1">Kedvencek</p>
        {#await userController.favouritesRequestResult}
            {@const numGhosts = 5}
            <div class="flex-[0_0_auto] w-full flex flex-col gap-y-1">
                {#each {length: numGhosts} as _}
                    <span class="flex-[0_0_2rem] w-full flex gap-x-2 pr-2">
                        <span id="loading-shimmer" class="flex-[1_1_auto] h-full"></span>
                        <span id="loading-shimmer" class="h-full aspect-square"></span>
                    </span>
                {/each}
            </div>
        {:then _}
            <div class="flex-[0_0_auto] min-h-0 w-full flex flex-col gap-y-1 overflow-y-auto">
                {#if userController.favourites?.length === 0}
                    <p class="h-8 w-full flex gap-x-2 items-center justify-center text-center text-sm">Még nincsenek kedvencek elmentve</p>
                {:else}
                    {#each userController.favourites as favourite}
                        <FavouriteItem favourite={favourite}/>
                    {/each}
                {/if}
            </div>
        {/await}
    </div>
{/snippet}
{#snippet logout()}
    {#snippet logoutIcon()}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"class="flex-[0_0_75%] aspect-square stroke-red-800">
            <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z" />
        </svg>
    {/snippet}
    <div class="flex-[0_0_auto] w-full pb-2 px-3.5 mt-auto flex justify-end items-center">
        <div id="logout-btn" role="button" tabindex="0"
            class="relative flex-[0_0_2rem] w-full flex justify-center items-center border-2
                rounded-sm border-red-800 hover:bg-red-200 transition-colors duration-200 hover:cursor-pointer"
            onclick={onLogoutBtnClick} onkeydown={() => {}}
        >   
            {@render logoutIcon()}
        </div>
    </div>
{/snippet}

<BlackScreenOverlay onclick={onPopupClose}>
    <div role="dialog" tabindex="-1"
        class="h-[clamp(20rem,80svh,36rem)] w-[clamp(18rem,40svw,24rem)] rounded-md bg-white pointer-events-auto"
        onclick={(e) => e.stopPropagation()}
        onmousedown={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
    >
        <div class="relative h-full min-h-0 w-full flex flex-col items-start justify-start">
            <DialogHeader title={"Felhasználói fiók"} onDismiss={onPopupClose}/>
            {#await userController.getUserRequestResult}
                <div id="favourites" class="flex-[1_1_auto] w-full flex flex-col items-start justify-start overflow-y-auto">
                    <div class="absolute top-0 left-0 h-full w-full bg-zinc-900/80 rounded-sm flex justify-center items-center">
                        <span id="loader" class="flex-[0_0_50%] aspect-square"></span>
                    </div>
                </div>
            {:then user}
                <div class="flex-[1_1_auto] w-full flex flex-col gap-y-3 items-start justify-start overflow-y-auto">
                    {@render accountDetails(user)}
                    {@render favourites()}
                    {@render logout()}
                </div>
            {:catch err}
                <div class="relative h-full w-full bg-zinc-900/80 flex flex-col items-center justify-center">
                    <div id="retry-btn" role="button" tabindex="0"
                        class="h-16 flex justify-center items-center"
                        onclick={() => { userController.getUser(); }} onkeydown={() => {}}
                    >
                        <p class="flex-[1_1_0] text-white text-center">{err.message}</p>
                        <p class="flex-[1_1_0] text-white text-center">Újrapróbálás?</p>
                    </div>
                </div>
            {/await}
        </div>
    </div>
</BlackScreenOverlay>