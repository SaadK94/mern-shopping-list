const express = require('express');
const router = express.Router();

// Item Model
const Item = require('../models/Item');

// @route   GET api/items
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
	try {
		const items = await Item.find().sort({ date: -1 });

		return res.status(200).json({
			success: true,
			items
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: 'Server Error'
		});
	}
});

// @route   POST api/items
// @desc    Create an item
// @access  Public
router.post('/', async (req, res) => {
	try {
		const newItem = await Item.create(req.body);

		return res.status(201).json({
			success: true,
			item: newItem
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: 'Server Error'
		});
	}
});

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Public
router.delete('/:id', async (req, res) => {
	try {
		const item = await Item.findById(req.params.id);

		if (!item) {
			return res.status(404).json({
				success: false,
				error: 'Item was not found'
			});
		}

		await item.remove();

		return res.status(200).json({
			success: true,
			item
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: 'Server Error'
		});
	}
});

module.exports = router;
