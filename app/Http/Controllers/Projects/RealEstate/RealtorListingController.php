<?php

namespace App\Http\Controllers\Projects\RealEstate;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Response;

class RealtorListingController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'deleted' => $request->boolean('deleted'),
            ...$request->only(['by', 'order']),
        ];

        return inertia('Realtor/Index', [
            'filters' => $filters,
            'listings' => Auth::user()
                ->listings()
                ->filter($filters)
                ->withCount('images')
                ->withCount('offers')
                ->paginate(6)
                ->withQueryString(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Listing::class);

        return inertia('Realtor/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Listing::class);

        Auth::user()->listings()->create(
            $request->validate([
                'beds' => 'required|integer|min:1|max:20',
                'baths' => 'required|integer|min:1|max:20',
                'area' => 'required|integer|min:15|max:1500',
                'city' => 'required',
                'code' => 'required|integer',
                'street' => 'required',
                'price' => 'required|integer|min:1|max:20000000',
            ])
        );

        return redirect()->route('realtor.listing.index')->with('success', 'Listing was created!');
    }

    public function show(Listing $listing): Response
    {
        return inertia('Realtor/Show', [
            'listing' => $listing->load('offers', 'offers.bidder'),
        ]);
    }

    public function edit(Listing $listing): Response
    {
        Gate::authorize('update', $listing);

        return inertia('Realtor/Edit', ['listing' => $listing]);
    }

    public function update(Request $request, Listing $listing): RedirectResponse
    {
        Gate::authorize('update', $listing);

        $listing->update(
            $request->validate([
                'beds' => 'required|integer|min:0|max:20',
                'baths' => 'required|integer|min:0|max:20',
                'area' => 'required|integer|min:15|max:1500',
                'city' => 'required',
                'code' => 'required',
                'street' => 'required',
                'price' => 'required|integer|min:1|max:20000000',
            ])
        );

        return redirect()->route('realtor.listing.index')->with('success', 'Listing was updated!');
    }

    public function destroy(Listing $listing): RedirectResponse
    {
        Gate::authorize('delete', $listing);
        $listing->deleteOrFail();

        return redirect()->back()->with('success', 'Listing was deleted!');
    }

    public function restore(Listing $listing): RedirectResponse
    {
        Gate::authorize('restore', $listing);
        $listing->restore();

        return redirect()->back()->with('success', 'Listing was restored!');
    }
}
