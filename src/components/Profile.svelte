<script lang="ts">
    import { onMount } from "svelte";
    import { currentUser, pb } from "../pocketbase";
    import type { Campaign } from "../types";
    import Loader from "./Loader.svelte";

    let createdCampaigns: Campaign[];
    let savedCampaigns: Campaign[];
    let username = "";

    onMount(async () => {
        createdCampaigns = await pb
            .collection("campaigns")
            .getFullList<Campaign>({
                filter: `createdUser="${$currentUser.id}"`,
                sort: "-created",
                expand: "createdUser",
            });
        savedCampaigns = await pb
            .collection("campaigns")
            .getFullList<Campaign>({
                filter: `savedUsers~"${$currentUser.id}"`,
                sort: "-created",
                expand: "createdUser",
            });
    });

    async function changeUsername() {
        await pb
            .collection("users")
            .update($currentUser.id, { name: username });
    }

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
</script>

<main>
    {#if savedCampaigns && createdCampaigns && currentUser}
        <h3>Profile</h3>
        <p>Manage your profile and campaigns here.</p>
        <hr />
        <div class="d-flex align-items-center justify-content-between mb-3">
            <p>Email: {$currentUser.email}</p>
            {#if $currentUser.verified}
                <button class="btn btn-success" disabled>Verified</button>
            {:else}
                <button class="btn btn-success" on:click={verifyMail}
                    >Verify</button
                >
            {/if}
        </div>
        <div class="d-flex align-items-center justify-content-between mb-3">
            <p>Username: {$currentUser.name}</p>
            <button
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal">Change Username</button
            >
        </div>
        <div class="d-flex align-items-center justify-content-between mb-3">
            <p>Password</p>
            <button class="btn btn-primary" on:click={changePassword}
                >Change Password</button
            >
        </div>
        <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                            Modify Username
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="#usernameInput" class="form-label"
                                >Username</label
                            >
                            <input
                                type="text"
                                name="username"
                                id="@usernameInput"
                                class="form-control"
                                bind:value={username}
                            />
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal">Close</button
                        >
                        <button
                            type="button"
                            class="btn btn-primary"
                            data-bs-dismiss="modal"
                            on:click={changeUsername}>Save changes</button
                        >
                    </div>
                </div>
            </div>
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
        <hr />
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
                            ><button
                                class="btn btn-secondary"
                                on:click={() => removeCampaign(drive.id)}
                                >Remove</button
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
        {/if}
    {:else}
        <Loader />
    {/if}
</main>
