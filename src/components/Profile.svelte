<script lang="ts">
    import { onMount } from "svelte";
    import { currentUser, pb } from "../pocketbase";

    let createdCampaigns = [];
    let savedCampaigns = [];

    onMount(async () => {
        createdCampaigns = await pb.collection("campaigns").getFullList({
            filter: `createdUser="${$currentUser.id}"`,
            sort: "-created",
            expand: "createdUser",
        });
        console.log(createdCampaigns);
        savedCampaigns = await pb.collection("campaigns").getFullList({
            filter: `savedUsers~"${$currentUser.id}"`,
            sort: "-created",
            expand: "createdUser",
        });
        console.log(savedCampaigns);
    });

    async function verifyMail() {
        await pb.collection("users").requestVerification($currentUser.email);
        window.alert("Email Verification Sent");
    }

    async function changePassword() {
        window.alert("Password Change Email Sent");
        await pb.collection("users").requestPasswordReset($currentUser.email);
    }

    async function deleteCampaign(campaignId) {
        await pb.collection("campaigns").delete(campaignId);
        createdCampaigns = createdCampaigns.filter(
            (campaign) => campaign.id !== campaignId
        );
    }

    async function removeCampaign(campaignId: string) {
        let savedUsers = (await pb.collection("campaigns").getOne(campaignId)).savedUsers as any[]
        savedUsers = savedUsers.filter(user => user !== $currentUser.id)
        await pb.collection("campaigns").update(campaignId, {"savedUsers":savedUsers})
        savedCampaigns = savedCampaigns.fill(user => user !== $currentUser.id)
    }
</script>

<main>
    <h3>Profile</h3>
    <p>Manage your profile and campaigns here.</p>
    <hr />
    <p>Username: {$currentUser.name}</p>
    <div class="d-flex align-items-center justify-content-between">
        <p>Email: {$currentUser.email}</p>
        {#if $currentUser.verified}
            <button class="btn btn-success" disabled>Verified</button>
        {:else}
            <button class="btn btn-success" on:click={verifyMail}>Verify</button
            >
        {/if}
    </div>
    <div class="d-flex align-items-center justify-content-between">
        <p>Password</p>
        <button class="btn btn-primary" on:click={changePassword}
            >Change Password</button
        >
    </div>
    <br />
    <h3>Created Campaigns</h3>
    <p>Manage campigns that you've created here.</p>
    <hr />
    {#if createdCampaigns.length !== 0}
        {#each createdCampaigns as drive}
            <div class="card w-50 mb-4">
                <img
                    src="https://drivathon.pockethost.io/api/files/campaigns/{drive.id}/{drive.image}"
                    class="card-img-top img-fluid"
                    alt="tweet-img"
                />
                <div class="card-body">
                    <h5>{drive.title}</h5>
                    <p>
                        {@html drive.description?.slice(0, 300) + "..."}
                    </p>
                    <p>Posted by, {drive.expand?.createdUser?.name}</p>
                    <div class="btn-group">
                        <a class="btn btn-primary" href="/drive/{drive.id}"
                            >Details</a
                        ><button
                            class="btn btn-secondary"
                            on:click={() => deleteCampaign(drive.id)}
                            >Delete</button
                        >
                    </div>
                </div>
                <div class="card-footer">
                    <p class="text-muted">
                        posted on {drive.created}
                    </p>
                </div>
            </div>
        {/each}
    {:else}
        <p>No Campaigns Created</p>
    {/if}
    <hr>
    <h3>Saved Campaigns</h3>
    <p>Manage campaigns that you saved Here.</p>
    {#if savedCampaigns.length === 0}
        <p>No Campaigns Saved</p>
    {:else}
    {#each savedCampaigns as drive}
    <div class="card w-50 mb-4">
        <img
            src="https://drivathon.pockethost.io/api/files/campaigns/{drive.id}/{drive.image}"
            class="card-img-top img-fluid"
            alt="tweet-img"
        />
        <div class="card-body">
            <h5>{drive.title}</h5>
            <p>
                {@html drive.description?.slice(0, 300) + "..."}
            </p>
            <p>Posted by, {drive.expand?.createdUser?.name}</p>
            <div class="btn-group">
                <a class="btn btn-primary" href="/drive/{drive.id}"
                    >Details</a
                ><button class="btn btn-secondary" on:click={() => removeCampaign(drive.id)}>Remove</button>
            </div>
        </div>
        <div class="card-footer">
            <p class="text-muted">
                posted on {drive.created}
            </p>
        </div>
    </div>
{/each}
    {/if}
</main>
