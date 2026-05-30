<?php

// Role system: Portfolio uses integer `role` column (role=7 admin, role>=1 realtor).
// is_admin from Real Estate is replaced by role === 7 check via the existing admin middleware.

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    public function before(?User $user, string $ability): ?bool
    {
        if ((int) $user?->role === 7) {
            return true;
        }

        return null;
    }

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Listing $listing): bool
    {
        if ($listing->by_user_id === $user?->id) {
            return true;
        }

        return $listing->sold_at === null;
    }

    public function create(User $user): bool
    {
        return $user->isRealtor();
    }

    public function update(User $user, Listing $listing): bool
    {
        return $listing->sold_at === null && $listing->by_user_id === $user->id;
    }

    public function delete(User $user, Listing $listing): bool
    {
        return $listing->by_user_id === $user->id;
    }

    public function restore(User $user, Listing $listing): bool
    {
        return $listing->by_user_id === $user->id;
    }

    public function forceDelete(User $user, Listing $listing): bool
    {
        return $listing->by_user_id === $user->id;
    }
}
