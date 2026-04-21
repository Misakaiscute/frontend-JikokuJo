<script lang="ts">
    import { timeFormatter } from '../../../core/utils/timeFormatter';
    import { getRouteDesignation } from '../../../schedule/data/model/queryable';
    import type { Favourite } from '../../data/model/favourite';
    import UserController from '../userController.svelte';

    const userController: UserController = UserController.getUserControllerContext();

    let {favourite}: {favourite: Favourite} = $props()

    const onDelete = (): void => {
        userController.toggleFavourite(favourite.route.id, favourite.time);
    }
</script>

{#snippet trashcan()}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-[75%] aspect-square stroke-red-800" fill="none" viewBox="0 0 24 24" stroke-width="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V3h6v3" />
    </svg>
{/snippet}

<div id="favourite-item" class="flex-[1_1_auto] h-7 pl-1 flex">
    <div class="w-full h-full flex justify-center items-center truncate">
        <p style="--route-color: {'#' + (favourite.route.color ?? '000000')}"
            class="flex-[1_1_auto] min-w-0 flex font-medium truncate"
        >
            <span class="text-(--route-color)">{favourite.route.short_name} -&nbsp;</span>
            <span class="text-zinc-800">{getRouteDesignation.get(favourite.route.type)}</span>
        </p>
    </div>
    <div class="flex-[0_0_auto] h-full flex justify-center items-center truncate">
        <p class="flex-[0_0_auto] px-2 font-medium text-zinc-600 max-[800px]:text-base">
            {timeFormatter(favourite.time)}
        </p>
    </div>
    <div id="favourite-remove-btn" role="button" tabindex="0"
        class="h-full aspect-square flex justify-center items-center border-2 border-red-800 
            rounded-sm hover:bg-red-200 transition-colors duration-200 hover:cursor-pointer"
        onclick={onDelete} onkeydown={() => {}}
    >
        {@render trashcan()}
    </div>
</div>