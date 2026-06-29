<?php

namespace App\Notifications;

use App\Models\Offer;
use App\Notifications\Channels\ResendChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class OfferMade extends Notification
{
    use Queueable;

    public function __construct(private Offer $offer) {}

    public function via(object $notifiable): array
    {
        return ['database', ResendChannel::class];
    }

    public function toResend(object $notifiable): array
    {
        $listingUrl = route('realtor.listing.show', ['listing' => $this->offer->listing_id]);
        $amount     = number_format((float) $this->offer->amount, 2);

        return [
            'from'    => 'Mohi Portfolio <info@mohiebi.com>',
            'to'      => [$notifiable->email],
            'subject' => 'New offer on your listing',
            'html'    => view('emails.offer-made', [
                'amount'     => $amount,
                'listingUrl' => $listingUrl,
            ])->render(),
        ];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'offer_id'   => $this->offer->id,
            'listing_id' => $this->offer->listing_id,
            'amount'     => $this->offer->amount,
            'bidder_id'  => $this->offer->bidder_id,
        ];
    }
}
