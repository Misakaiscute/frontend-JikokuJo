<script lang="ts">
    import {slide} from "svelte/transition";
    import ScheduleSearchController from "../../scheduleSearchController.svelte.ts";
    import {onDestroy, onMount, tick} from "svelte";
    import {dateHelpers} from "../../../utils/dateHelpers.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();

    let dayCardsContainer!: Element;
    let sentinel!: Element;
    let intersectionObserver: IntersectionObserver | null = null;
    onMount(async () => {
        await tick();
        intersectionObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const newDays: Date[] = [];
                for (let i = 1; i <= 7; i++) {
                    newDays.push(dateHelpers(daySelectionList[daySelectionList.length - 1]).addDays(i));
                }
                daySelectionList = [...daySelectionList, ...newDays];
            }
        }, {
            root: dayCardsContainer,
            rootMargin: "50px",
            threshold: 1,
        });

        if (sentinel) intersectionObserver.observe(sentinel);
    });
    onDestroy(() => intersectionObserver?.disconnect());

    const PREV_DAYS: number = 2;
    const NEXT_DAYS: number = 14;
    const monthIntToStringMap = Object.freeze([
        "Jan", "Feb", "Már", "Ápr",
        "Máj", "Jún", "Júl", "Aug",
        "Szept", "Okt", "Nov", "Dec"
    ]);

    const initialDaySelection: Date[] = [];
    for (let i = -PREV_DAYS; i <= NEXT_DAYS; i++) {
        const todayStrippedToDays: Date = dateHelpers(Date.now()).getStartOfDay();
        initialDaySelection.push(
            dateHelpers(todayStrippedToDays).addDays(i)
        );
    }
    let daySelectionList: Date[] = $state(initialDaySelection);

    const onClose = () => { scheduleSearchController.dateTimePickerDropdown = null; };
    const onSetDate = (date: Date) => {
        const todaySelected: boolean = dateHelpers(date).sameDayAs(Date.now());
        const isPastInTime: boolean = dateHelpers(date).dayInMinutes() < dateHelpers(Date.now()).dayInMinutes();
        if (todaySelected && isPastInTime){
            scheduleSearchController.date = new Date(Date.now());
        } else {
            date.setHours(
                scheduleSearchController.date.getHours(),
                scheduleSearchController.date.getMinutes(),
                0, 0
            );
            scheduleSearchController.date = date;
        }

        scheduleSearchController.dateTimePickerDropdown = null;
    }
    const onSetToday = () => { onSetDate(dateHelpers(Date.now()).getStartOfDay()); }
</script>

{#snippet dateCard(date: Date, isInteractable: boolean)}
    {#snippet content(date: Date)}
        <div class="flex-[0_0_auto] w-full flex justify-center items-center">
            <p class="flex-[1_1_auto] h-full px-0.5 text-xs text-center">{date.getFullYear()}</p>
        </div>
        <div class="flex-[0_0_auto] w-full flex justify-end items-center">
            <p class="flex-[1_1_auto] h-full text-lg text-center">{String(date.getDate()).padStart(2, '0')}</p>
        </div>
        <div class="flex-[0_0_auto] w-full flex items-center">
            <p class="flex-[1_1_auto] h-full px-2 text-xs text-center">{monthIntToStringMap[date.getMonth()]}.</p>
        </div>
    {/snippet}

    {#if !isInteractable}
        <div id="date-card-item-disabled" class="relative flex-[0_0_3rem] h-full flex flex-col justify-around items-center border-zinc-200 border-2 rounded-sm">
            {@render content(date)}
            <span class="absolute top-0 left-0 w-full h-full bg-zinc-950/60 rounded-sm pointer-events-auto"></span>
        </div>
    {:else}
        <div id="date-card-item" role="button" tabindex="0"
            class="relative flex-[0_0_3rem] h-full flex flex-col justify-around items-center border-2 rounded-sm
                 bg-white border-zinc-200 hover:border-zinc-800 transition-colors duration-200 hover:cursor-pointer"
            onclick={() => { onSetDate(date) }} onkeydown={() => {}}
        >
            {@render content(date)}
        </div>
    {/if}
{/snippet}

<div in:slide={{ duration: 200, delay: 150 }} out:slide={{ duration: 100 }}
     class="flex-[0_0_auto] w-full flex flex-col items-center justify-center bg-zinc-200 rounded-b-sm"
>
    <div bind:this={dayCardsContainer} id="date-cards" class="flex-[0_0_5rem] w-full flex items-center justify-start overflow-x-scroll disable-scrollbars">
        {#each daySelectionList as day}
            {#if dateHelpers(Date.now()).isPastDay(day)}
                {@render dateCard(day, false)}
            {:else}
                {@render dateCard(day, true)}
            {/if}
        {/each}
        <div bind:this={sentinel} class="flex-[0_0_1px] h-full"></div>
    </div>
    <div class="flex-[0_0_1rem] w-full px-0.5 my-0.5 flex gap-x-1 items-center justify-center">
        <div id="done-btn" role="button" tabindex="0"
            class="flex-[1_1_auto] h-full flex justify-center items-center bg-white border-2 border-transparent rounded-sm
                  transition-colors duration-200 hover:border-zinc-800 hover:cursor-pointer"
            onclick={onClose} onkeydown={() => {}}
        >
            <p class="flex-[1_1_auto] h-full text-sm text-center">Kész</p>
        </div>
        <div id="set-current-btn" role="button" tabindex="0"
            class="flex-[1_1_auto] h-full flex justify-center items-center bg-white border-2 border-transparent rounded-sm
                  transition-colors duration-200 hover:border-zinc-800 hover:cursor-pointer"
            onclick={onSetToday} onkeydown={() => {}}
        >
            <p class="flex-[1_1_auto] h-full text-sm text-center">Ma</p>
        </div>
    </div>
</div>