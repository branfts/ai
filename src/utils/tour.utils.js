import { useShepherd } from 'vue-shepherd'
import 'shepherd.js/dist/css/shepherd.css'

function tourInit(refs, smAndDown, offset, dialog, start) {
    const tour = useShepherd({
        useModalOverlay: true,
        defaultStepOptions: {
            scrollTo: true,
            modalOverlayOpeningRadius: 4,
            modalOverlayOpeningPadding: 4,
            cancelIcon: {
                enabled: true,
            },
            floatingUIOptions: {
                middleware: [offset({ mainAxis: 24 })],
            },
        }
    })
    tour.addStep(
        {
            title: `Start on the Ai Tour!`,
            text: `<p class="mb-4">You’ve just landed on what should become your new favorite spot for organizing your online life (links).</p>
            <p class="mb-4">Here, you'll find a no-BS index that will have you ditching that old link tree in no time.🚀</p>
            <p class="mb-4">It’s free, open-source, and built on a rock-solid foundation by a diverse group of developers.🌍</p>
            <p class="mb-4">A simple index on the Internet should be a right for everyone—this is your first step.✨</p>`,
            buttons: [
                {
                    text: 'Next',
                    action: tour.next,
                },
            ],
        },
        1
    )

    Object.entries(refs)
        .filter(kv => kv[1].ref.value)
        .forEach(kv => {
            const key = kv[0]
            const val = kv[1]

            if (/tour-list/.test(key)) {
                tour.addStep(
                    {
                        attachTo: { element: val.ref.value.$el, on: /tour-list-top/.test(key) ? 'bottom' : 'top' },
                        title: 'Here is your link index.',
                        text: `<ul class="ma-4 text-center">
                            <li class="d-flex font-italic">
                                <i class="material-icons mr-2 text-green">check_circle</i>Unlimited links
                            </li>
                            <li class="d-flex font-italic">
                                <i class="material-icons mr-2 text-green">check_circle</i>Time-based auto redirects
                            </li>
                            <li class="d-flex font-italic">
                                <i class="material-icons mr-2 text-green">check_circle</i>Scheduled links (soon)
                            </li>
                            <li class="d-flex font-italic">
                                <i class="material-icons mr-2 text-green">check_circle</i>Click Analytics
                            </li>
                            <li class="d-flex font-italic">
                                <i class="material-icons mr-2 text-green">check_circle</i>Unmatched data export capabilities
                            </li>
                        </ul>
                        `,
                        buttons: [
                            {
								text: 'Back',
								action: tour.back,
							},
							{
								text: 'Next',
								action: tour.next,
							},
                        ],
                    },
                    val.index
                )
            } else if (/tour-git-button/.test(key)) {
                tour.addStep(
                    {
                        attachTo: { element: val.ref.value.$el, on: /tour-git-button/.test(key) ? 'bottom' : 'top' },
                        title: `Fork your index's repo!`,
                        text: `<p>Your index is just a simple Git managed static text (JavaScript) file.
                            <p class="mb-4">Making changes is as simple as forking the repo.</p>
                            <p class="mb-4">Eventually the web UI will be at parity with direct repo access for updates.</p>
                        `,
                        buttons: [
                            {
								text: 'Back',
								action: tour.back,
							},
							{
								text: 'Next',
								action: tour.next,
							},
                        ],
                    },
                    val.index
                )
            } else if (/tour-share-button/.test(key)) {
                tour.addStep(
                    {
                        attachTo: { element: val.ref.value.$el, on: /tour-share-button/.test(key) ? 'bottom' : 'top' },
                        title: `Share your index with others!`,
                        text: `Easily share your index with others via a QR code, hex code, or URL.`,
                        buttons: [
                            {
								text: 'Back',
								action: () => {
                                    dialog.value = false
                                    tour.next()
                                },
							},
							{
								text: 'Next',
								action: () => {
                                    dialog.value = true
                                    tour.next()
                                },
							},
                        ],
                    },
                    val.index
                )
            } else if (/tour-share-qrcode/.test(key)) {
                tour.addStep(
                    {
                        attachTo: { element: val.ref.value.$el, on: /tour-share-qrcode/.test(key) ? 'bottom' : 'top' },
                        title: `Share your index with a QR code!`,
                        text: `Your QR code can be used to easily share your index with others.`,
                        buttons: [
                            {
								text: 'Back',
								action: tour.back,
							},
							{
								text: 'Next',
								action: tour.next,
							},
                        ],
                    },
                    val.index
                )
            } else if (/tour-share-hex/.test(key)) {
                tour.addStep(
                    {
                        attachTo: { element: val.ref.value.$el, on: /tour-share-hex/.test(key) ? 'bottom' : 'top' },
                        title: `Share your index with a hex code!`,
                        text: `Your hex code can be used to easily share your index with others.`,
                        buttons: [
                            {
								text: 'Back',
								action: tour.back,
							},
							{
								text: 'Next',
								action: tour.next,
							},
                        ],
                    },
                    val.index
                )
            } else if (/tour-share-url/.test(key)) {
                tour.addStep(
                    {
                        attachTo: { element: val.ref.value.$el, on: /tour-share-url/.test(key) ? 'bottom' : 'top' },
                        title: `Share your index with a good ol' URL!`,
                        text: `Your QR code can be used to easily share your index with others.`,
                        buttons: [
                            {
								text: 'Back',
								action: tour.back,
							},
							{
								text: 'Next',
								action: tour.next,
							},
                        ],
                    },
                    val.index
                )
            } else if (/tour-button/.test(key)) {
				tour.addStep(
					{
						attachTo: smAndDown ? undefined : { element: val.ref.value.$el },
						title: `Congrats on your better link sharing solution!`,
						text: `<p class="mb-4">Revisit the tour anytime by clicking the info icon</p>
                        🪓🪓
                        `,
						buttons: [
							{
								text: 'Back',
								action: tour.back,
							},
							{
								text: 'Complete',
								action: tour.complete,
							},
						],
					},
					val.index
				)
			}
        })
        

    if (start) {
        tour.start()
    }
    return tour
}

export {
    tourInit
}
