<script lang="ts">
    import { onMount } from "svelte";
    import type { Campaign } from "../types";
    import { pb, currentUser } from "../pocketbase";
    import Loader from "./Loader.svelte";
    import { navigate } from "svelte-navigator";

    let savedCampaigns: Campaign[];

    onMount(async () => {
        savedCampaigns = await pb.collection("campaigns").getFullList({
            filter: `savedUsers~"${$currentUser.id}"`,
            sort: "-created",
            expand: "createdUser",
        });
    });

    async function removeCampaign(campaignId: string) {
        let savedUsers = (
            await pb.collection("campaigns").getOne<Campaign>(campaignId)
        ).savedUsers;
        savedUsers = savedUsers.filter((user) => user !== $currentUser.id);
        await pb
            .collection("campaigns")
            .update(campaignId, { savedUsers: savedUsers });
        savedCampaigns = await pb
            .collection("campaigns")
            .getFullList<Campaign>({
                filter: `savedUsers~"${$currentUser.id}"`,
                sort: "-created",
                expand: "createdUser",
            });
    }

    function visitChatroom(campaignid: string) {
        navigate(`/chat/${campaignid}`)
    }
</script>

<main>
    {#if savedCampaigns}
        {#if savedCampaigns.length === 0}
            <div class="d-flex align-items-center justify-content-center">
                <h3>
                    No Chatrooms! Go Join some fucking Campaigns and Touch some
                    grass!
                </h3>
            </div>
        {:else}
            {#each savedCampaigns as campaign}
                <div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img
                                src="https://drivathon.pockethost.io/api/files/campaigns/{campaign.id}/{campaign.image}"
                                class="img-fluid rounded-start"
                                alt={campaign.title}
                            />
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title">{campaign.title}</h5>
                                <p class="card-text">
                                    {@html campaign.description.slice(0, 300) +
                                        "..."}
                                </p>
                                <p class="card-text">
                                    <small class="text-muted"
                                        >{new Date(
                                            campaign.created
                                        ).toLocaleString()}</small
                                    >
                                </p>
                                <div class="btn-group">
                                    <button class="btn btn-primary" on:click={() => visitChatroom(campaign.id)}>Enter Chatroom</button>
                                    <button class="btn btn-danger" on:click={async () => await removeCampaign(campaign.id)}>Remove</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        {/if}
    {:else}
        <Loader />
    {/if}
</main>
