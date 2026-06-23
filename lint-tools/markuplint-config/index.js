export default {
	nodeRules: [
		{
			selector: "script[src^='https://']",
			rules: {
				'required-attr': "External scripts are not allowed.",
			},
		},
	],
};
