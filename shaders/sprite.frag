/* sprite.frag
Copyright (c) 2014 by Michael Zahniser

Endless Sky is free software: you can redistribute it and/or modify it under the
terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

Endless Sky is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.
*/

// Disable Endless Sky's automatic shader versioning
//autoversion off
#version 110

uniform sampler3D tex;
uniform sampler3D swizzleMask;
uniform int useSwizzleMask;
uniform float frame;
uniform float frameCount;
uniform int uniqueSwizzleMaskFrames;
uniform vec2 blur;
uniform mat4 swizzleMatrix;
uniform int useSwizzle;
uniform float alpha;

const float range = 5.;

varying vec2 fragTexCoord;

void main() {
	float first = (floor(frame) + .5) / frameCount;
	float second = (mod(ceil(frame), frameCount) + .5) / frameCount;
	float fade = (frame + .5) / frameCount - first;
	vec4 color;
	if(blur.x == 0. && blur.y == 0.)
	{
		if(fade != 0.)
			color = mix(
				texture3D(tex, vec3(fragTexCoord, first)),
				texture3D(tex, vec3(fragTexCoord, second)), fade);
		else
			color = texture3D(tex, vec3(fragTexCoord, first));
	}
	else
	{
		color = vec4(0., 0., 0., 0.);
		const float divisor = range * (range + 2.) + 1.;
		for(float i = -range; i <= range; ++i)
		{
			float scale = (range + 1. - abs(i)) / divisor;
			vec2 coord = fragTexCoord + blur * i / range;
			if(fade != 0.)
				color += scale * mix(
					texture3D(tex, vec3(coord, first)),
					texture3D(tex, vec3(coord, second)), fade);
			else
				color += scale * texture3D(tex, vec3(coord, first));
		}
	}
	if(useSwizzle > 0)
	{
		vec4 swizzleColor;
		swizzleColor = color * swizzleMatrix;
		if(useSwizzleMask > 0)
		{
			float swizzleMaskFrame = 0.;
			if(uniqueSwizzleMaskFrames > 0)
				swizzleMaskFrame = first;
			float factor = texture3D(swizzleMask, vec3(fragTexCoord, swizzleMaskFrame)).r;
			color = color * factor + swizzleColor * (1.0 - factor);
		}
		else
			color = swizzleColor;
	}
	gl_FragColor = color * alpha;
}
