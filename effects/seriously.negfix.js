/* global define, require */
(function (root, factory) {
	'use strict';

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['seriously'], factory);
	} else if (typeof exports === 'object') {
		// Node/CommonJS
		factory(require('seriously'));
	} else {
		if (!root.Seriously) {
			root.Seriously = { plugin: function (name, opt) { this[name] = opt; } };
		}
		factory(root.Seriously);
	}
}(window, function (Seriously) {
	'use strict';

	Seriously.plugin('negfix', {
		commonShader: true,
		shader: function (inputs, shaderSource) {
			shaderSource.fragment = [
				'precision mediump float;',

				'varying vec2 vTexCoord;',

				'uniform sampler2D source;',

				'const float halfsies = 0.5;',

				'uniform float rBlackLevel;',
				'uniform float rWhiteLevel;',
				'uniform float gBlackLevel;',
				'uniform float gWhiteLevel;',
				'uniform float bBlackLevel;',
				'uniform float bWhiteLevel;',

				'uniform float contrast;',
				'uniform float exposure;',
				'const vec3 half3 = vec3(0.5);',


				'void main (void)  {',
				'	vec4 pixel = texture2D(source, vTexCoord);',

				'	float c = pixel.r;',
				'	float m = pixel.g;',
				'	float y = pixel.b;',

				'	float yellowLayer = c * 0.2;',
				'	float redLayer = c * 0.4;',

				'	float yO = yellowLayer + y;',
				'	yO = redLayer + yO;',
				'	float mO = redLayer + m;',

				'	pixel = vec4(1.0-c,1.0-mO,1.0-yO,1.0);',

				'	pixel = vec4(mix(rBlackLevel,rWhiteLevel,pixel.r),mix(gBlackLevel,gWhiteLevel,pixel.g),mix(bBlackLevel,bWhiteLevel,pixel.b), 1.0);',
				'	pixel = vec4(pow(2.0, exposure) * pixel.rgb, 1.0);',
				'	pixel = vec4((pixel.rgb - half3) * contrast + half3,1.0);',

				'	gl_FragColor = pixel;',
				'}',
			].join('\n');
			return shaderSource;
		},
		inPlace: true,
		inputs: {
			source: {
				type: 'image',
				uniform: 'source',
				shaderDirty: false
			},
			rWhiteLevel: {
				type: 'number',
				uniform: 'rWhiteLevel',
				defaultValue: 1,
				min: .5,
				max: 1.5
			},
			rBlackLevel: {
				type: 'number',
				uniform: 'rBlackLevel',
				defaultValue: 0,
				min: -.5,
				max: .5
			},
			gWhiteLevel: {
				type: 'number',
				uniform: 'gWhiteLevel',
				defaultValue: 1,
				min: .5,
				max: 1.5
			},
			gBlackLevel: {
				type: 'number',
				uniform: 'gBlackLevel',
				defaultValue: 0,
				min: -.5,
				max: .5
			},
			bWhiteLevel: {
				type: 'number',
				uniform: 'bWhiteLevel',
				defaultValue: 1,
				min: .5,
				max: 1.5
			},
			bBlackLevel: {
				type: 'number',
				uniform: 'bBlackLevel',
				defaultValue: 0,
				min: -.5,
				max: .5
			},
			contrast: {
				type: 'number',
				uniform: 'contrast',
				defaultValue: .5,
				min: 0,
				max: 1.5
			},
			exposure: {
				type: 'number',
				uniform: 'exposure',
				defaultValue: 0,
				min: -1.5,
				max: 1.5
			}
		},
		title: 'Color Negative Fixer',
		categories: ['film'],
		description: 'Flips negatives, removes orange cast.'
	});
}));