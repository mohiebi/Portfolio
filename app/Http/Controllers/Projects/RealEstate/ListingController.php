<?php

namespace App\Http\Controllers\Projects\RealEstate;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class ListingController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Listing::class);

        $filters = $request->only(['priceFrom', 'priceTo', 'beds', 'baths', 'areaFrom', 'areaTo']);

        return inertia('Listing/Index', [
            'filters' => $filters,
            'listings' => Listing::mostRecent()
                ->filter($filters)
                ->withoutSold()
                ->paginate(12)
                ->withQueryString(),
        ]);
    }

    public function show(Listing $listing): Response
    {
        Gate::authorize('view', $listing);

        $listing->load('images');
        $offer = Auth::user()
            ? $listing->offers()->byMe()->first()
            : null;

        return inertia('Listing/Show', [
            'listing' => $listing,
            'offerMade' => $offer,
        ]);
    }
}
