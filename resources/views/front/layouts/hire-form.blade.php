<div class="hire">
    <h2>You want us to do</h2>
    <!-- checkout formspree.io for easy form setup -->
    <form class="work-request" method="POST" action="{{route('contact')}}">
      @csrf
      <div class="work-request--options">
        <span class="options-a">
          <input id="opt-1" name="options[]" type="checkbox" value="UI/UXDesign">
          <label for="opt-1">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 150 111" style="enable-background:new 0 0 150 111;" xml:space="preserve">
            <g transform="translate(0.000000,111.000000) scale(0.100000,-0.100000)">
              <path d="M950,705L555,310L360,505C253,612,160,700,155,700c-6,0-44-34-85-75l-75-75l278-278L550-5l475,475c261,261,475,480,475,485c0,13-132,145-145,145C1349,1100,1167,922,950,705z"/>
            </g>
            </svg>
            UI / UX Design
          </label>
          <input id="opt-2" name="options[]" type="checkbox" value="WordpressPlugin" >
          <label for="opt-2">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 150 111" style="enable-background:new 0 0 150 111;" xml:space="preserve">
            <g transform="translate(0.000000,111.000000) scale(0.100000,-0.100000)">
              <path d="M950,705L555,310L360,505C253,612,160,700,155,700c-6,0-44-34-85-75l-75-75l278-278L550-5l475,475c261,261,475,480,475,485c0,13-132,145-145,145C1349,1100,1167,922,950,705z"/>
            </g>
            </svg>
            Wordpress Plugin
          </label>
          <input id="opt-3" name="options[]" type="checkbox" value="WordpressTheme">
          <label for="opt-3">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 150 111" style="enable-background:new 0 0 150 111;" xml:space="preserve">
            <g transform="translate(0.000000,111.000000) scale(0.100000,-0.100000)">
              <path d="M950,705L555,310L360,505C253,612,160,700,155,700c-6,0-44-34-85-75l-75-75l278-278L550-5l475,475c261,261,475,480,475,485c0,13-132,145-145,145C1349,1100,1167,922,950,705z"/>
            </g>
            </svg>
            Wordpress Theme
          </label>
        </span>
        <span class="options-b">
          <input id="opt-4" name="options[]" type="checkbox" value="RestApi">
          <label for="opt-4">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 150 111" style="enable-background:new 0 0 150 111;" xml:space="preserve">
            <g transform="translate(0.000000,111.000000) scale(0.100000,-0.100000)">
              <path d="M950,705L555,310L360,505C253,612,160,700,155,700c-6,0-44-34-85-75l-75-75l278-278L550-5l475,475c261,261,475,480,475,485c0,13-132,145-145,145C1349,1100,1167,922,950,705z"/>
            </g>
          </svg>
          RestApi
        </label>
        <input id="opt-5" name="options[]" type="checkbox" value="WebsiteDeveloper">
          <label for="opt-5">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 150 111" style="enable-background:new 0 0 150 111;" xml:space="preserve">
            <g transform="translate(0.000000,111.000000) scale(0.100000,-0.100000)">
              <path d="M950,705L555,310L360,505C253,612,160,700,155,700c-6,0-44-34-85-75l-75-75l278-278L550-5l475,475c261,261,475,480,475,485c0,13-132,145-145,145C1349,1100,1167,922,950,705z"/>
            </g>
            </svg>
            Website Developer
          </label>
          <input id="opt-6" name="options[]" type="checkbox" value="WebMobileApp">
          <label for="opt-6">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 150 111" style="enable-background:new 0 0 150 111;" xml:space="preserve">
            <g transform="translate(0.000000,111.000000) scale(0.100000,-0.100000)">
              <path d="M950,705L555,310L360,505C253,612,160,700,155,700c-6,0-44-34-85-75l-75-75l278-278L550-5l475,475c261,261,475,480,475,485c0,13-132,145-145,145C1349,1100,1167,922,950,705z"/>
            </g>
            </svg>
            Web Mobile App
          </label>
        </span>
      </div>
      <div class="work-request--information">
        <div class="information-name">
          <input id="name" name="name" type="text" spellcheck="false">
          <label for="name">Name</label>
        </div>
        <div class="information-email">
          <input id="email" name="email" type="email" spellcheck="false">
          <label for="email">Email</label>
        </div>
      </div>
      <button class="btn-submit" type="submit">Send Request</button>
    </form>
  </div>