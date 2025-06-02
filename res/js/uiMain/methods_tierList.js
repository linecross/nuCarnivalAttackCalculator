import { Team, Card, CardCenter } from '/build/Card.js';

export default {
	  addNewTier() {
		const newTierIndex = this.tierList.tiers.length;
		this.tierList.tiers.push({
		  id: `tier-${newTierIndex}`,
		  name: `Tier ${newTierIndex + 1}`,
		  color: '#333333',
		  cards: [],
		  order: newTierIndex + 1
		});
	  },
	  removeTier(index) {
		const tier = this.tierList.tiers[index];
		this.tierList.unrankedCards.push(...tier.cards);
		this.tierList.tiers.splice(index, 1);
	  },
	  handleTierNameChange(index, event) {
		this.tierList.tiers[index].name = event.target.value.trim() || `Tier ${index + 1}`;
	  },
	  handleTierColorChange(index, event) {
		this.tierList.tiers[index].color = event.target.value;
	  },
	  handleCardDragStart(event, cardId) {
		event.stopPropagation();
		event.dataTransfer.setData('type', 'card');
		event.dataTransfer.setData('text/plain', cardId);
		this.tierList.draggedCardId = cardId;
		event.target.classList.add('dragging');
	  },
	  handleCardDragEnd(event) {
		event.stopPropagation();
		this.tierList.draggedCardId = null;
		event.target.classList.remove('dragging');
		document.querySelectorAll('.tier-content').forEach(container => {
		  container.classList.remove('drag-over');
		});
	  },
	  handleCardDragOver(event) {
		if (event.dataTransfer.getData('type') === 'card') {
		  event.preventDefault();
		}
	  },
	  handleCardDragEnter(event) {
		if (event.dataTransfer.getData('type') === 'card') {
		  event.preventDefault();
		  event.stopPropagation();
		  const content = event.target.closest('.tier-content');
		  if (content) {
			content.classList.add('drag-over');
		  }
		}
	  },
	  handleCardDragLeave(event) {
		event.stopPropagation();
		const content = event.target.closest('.tier-content');
		if (content) {
		  content.classList.remove('drag-over');
		}
	  },
	  handleCardDrop(event, targetTierIndex) {
		if (event.dataTransfer.getData('type') !== 'card') return;
		event.preventDefault();
		event.stopPropagation();
		const cardName = event.dataTransfer.getData('text/plain');
		let card = null;
		const unrankedIndex = this.tierList.unrankedCards.findIndex(c => c.name === cardName);
		if (unrankedIndex !== -1) {
		  card = this.tierList.unrankedCards.splice(unrankedIndex, 1)[0];
		} else {
		  for (let i = 0; i < this.tierList.tiers.length; i++) {
			const cardIndex = this.tierList.tiers[i].cards.findIndex(c => c.name === cardName);
			if (cardIndex !== -1) {
			  card = this.tierList.tiers[i].cards.splice(cardIndex, 1)[0];
			  break;
			}
		  }
		}
		if (card && targetTierIndex >= 0) {
		  this.tierList.tiers[targetTierIndex].cards.push(card);
		} else if (card && targetTierIndex === -1) {
		  this.tierList.unrankedCards.push(card);
		}
		document.querySelectorAll('.tier-content').forEach(container => {
		  container.classList.remove('drag-over');
		});
	  },
	  handleTierDragStart(event, index) {
		event.dataTransfer.setData('type', 'tier');
		event.dataTransfer.setData('text/plain', this.tierList.tiers[index].id);
		this.tierList.draggedTierIndex = index;
		event.target.classList.add('dragging');
	  },
	  handleTierDragEnd(event) {
		this.tierList.draggedTierIndex = null;
		event.target.classList.remove('dragging');
		document.querySelectorAll('.tier').forEach(tier => {
		  tier.classList.remove('drag-over');
		});
	  },
	  handleTierDragOver(event) {
		if (event.dataTransfer.getData('type') === 'tier') {
		  event.preventDefault();
		}
	  },
	  handleTierDragEnter(event, index) {
		if (event.dataTransfer.getData('type') === 'tier') {
		  event.preventDefault();
		  const tier = event.target.closest('.tier');
		  if (tier && !tier.classList.contains('unranked')) {
			tier.classList.add('drag-over');
		  }
		}
	  },
	  handleTierDragLeave(event) {
		const tier = event.target.closest('.tier');
		if (tier) {
		  tier.classList.remove('drag-over');
		}
	  },
	  handleTierDrop(event, targetIndex) {
		if (event.dataTransfer.getData('type') !== 'tier') return;
		event.preventDefault();
		const draggedIndex = this.tierList.draggedTierIndex;
		if (draggedIndex !== null && targetIndex !== draggedIndex) {
		  const [draggedTier] = this.tierList.tiers.splice(draggedIndex, 1);
		  this.tierList.tiers.splice(targetIndex, 0, draggedTier);
		}
		document.querySelectorAll('.tier').forEach(tier => {
		  tier.classList.remove('drag-over');
		});
	  },
	  setTierListUnRankedCards(){
		var arr = [];
		var cardData = CardCenter.getCardData();
		for (var card of Object.entries(cardData)) {
			arr.push(card);
		}

		var chars = this.tierList.char;
		var rarity = this.tierList.rarity;
		var clazz = this.tierList.clazz;
		var element = this.tierList.element;
		var coolDown = this.tierList.coolDown;
		
		if (chars.length > 0){
			arr = arr.filter(e=>chars.includes(e[1].char));
		}
		if (rarity.length > 0){
			arr = arr.filter(e=>rarity.includes(e[1].rarity));
		}
		if (clazz.length > 0){
			arr = arr.filter(e=>clazz.includes(e[1].class));
		}
		if (element.length > 0){
			arr = arr.filter(e=>element.includes(e[1].element));
		}
		if (coolDown.length > 0){
			arr = arr.filter(e=>coolDown.includes(e[1].coolDown));
		}
		
		arr = arr.reverse();
		arr.forEach(e => e[1].name = e[0]);
		arr = arr.map(e=>e[1]);
		// return arr;
		for (var tier of this.tierList.tiers){
			for (var card of tier.cards){
				arr = arr.filter(e=>e.name != card.name);
			}
		}

		this.tierList.unrankedCards = arr;
	  },
	  getTierListUnRankedCards(){
		// this.setTierListUnRankedCards();
		return this.tierList.unrankedCards;
	  }
}