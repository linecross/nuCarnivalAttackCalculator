import appData from './uiMain/data.js';
import appMethods from './uiMain/methods.js';
import appComputed from './uiMain/computed.js';
import appWatch from './uiMain/watch.js';
import created from './uiMain/created.js';
// import jsonCardData from './../../res/json/cardData.json' with { type: 'json' };
// import jsonEnemyData from './../../res/json/enemyData.json' with { type: 'json' };


Vue.createApp({
    data: appData,
	created,
	mounted: function(){
		this.$watch(vm => [vm.setting], val => {
			this.saveSettingFromStorage();
		}, {
			immediate: true,
			deep: true
		});

		this.createSortable();
	},
	updated()
	{
		const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
		const popoverList = [...popoverTriggerList].map(popoverTriggerEl => bootstrap.Popover.getOrCreateInstance(popoverTriggerEl, {
			'animation': false
		}));
		popoverList.forEach(e=>e._config.content=e._element.getAttribute('data-bs-content'));

		// Performance tune: clear damage records after close modal
		const myModalEl = document.getElementById('damageRecordModal')
		if (myModalEl != null){
			myModalEl.addEventListener('hidden.bs.modal', event => {
				this.damageRecords = [];
			})
		}

		// Add back draggable after UI changes
		const charInputList = document.querySelector('#charInputList');
		if (charInputList != null && !charInputList.classList.contains('isDraggable')){
			this.createSortable();
		}
	},
	methods: appMethods,
	computed: appComputed,
	watch: appWatch
}).mount('#NuCarnivalAttackCalApp');