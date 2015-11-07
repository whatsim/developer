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

				'uniform float rContrast;',
				'uniform float gContrast;',
				'uniform float bContrast;',

				'uniform float rExposure;',
				'uniform float gExposure;',
				'uniform float bExposure;',
				'const float halfsies = 0.5;',

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

				'	pixel = vec4(pow(2.0, rExposure) * pixel.r,pow(2.0, gExposure) * pixel.g,pow(2.0, bExposure) * pixel.b, 1.0);',
				'	pixel = vec4((pixel.r - halfsies) * rContrast + halfsies, (pixel.g - halfsies) * gContrast + halfsies, (pixel.b - halfsies) * bContrast + halfsies, 1.0);',

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
			rContrast: {
				type: 'number',
				uniform: 'rContrast',
				defaultValue: .5,
				min: 0,
				max: 1.5
			},
			rExposure: {
				type: 'number',
				uniform: 'rExposure',
				defaultValue: 0,
				min: -1.5,
				max: 1.5
			},
			bContrast: {
				type: 'number',
				uniform: 'bContrast',
				defaultValue: .5,
				min: 0,
				max: 1.5
			},
			bExposure: {
				type: 'number',
				uniform: 'bExposure',
				defaultValue: 0,
				min: -1.5,
				max: 1.5
			},
			gContrast: {
				type: 'number',
				uniform: 'gContrast',
				defaultValue: .5,
				min: 0,
				max: 1.5
			},
			gExposure: {
				type: 'number',
				uniform: 'gExposure',
				defaultValue: 0,
				min: -1.5,
				max: 1.5
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