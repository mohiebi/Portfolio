<?php

namespace App\Http\Controllers\Projects\RealEstate;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class RealtorListingImageController extends Controller
{
    public function create(Listing $listing): Response
    {
        $listing->load('images');

        return inertia('Realtor/Image/Create', ['listing' => $listing]);
    }

    public function store(Listing $listing, Request $request): RedirectResponse
    {
        if ($request->hasFile('images')) {
            $request->validate(
                ['images.*' => 'mimes:jpg,png,jpeg,webp|max:5000'],
                ['images.*.mimes' => 'The file must be in one of the formats: jpg, png, jpeg, webp']
            );

            foreach ($request->file('images') as $file) {
                $path = $file->store('images', 'public');
                $listing->images()->create(['filename' => $path]);
            }
        }

        return redirect()->back()->with('success', 'Images uploaded!');
    }

    public function destroy(Listing $listing, ListingImage $image): RedirectResponse
    {
        Storage::disk('public')->delete($image->filename);
        $image->delete();

        return back()->with('success', 'Image was deleted!');
    }
}
