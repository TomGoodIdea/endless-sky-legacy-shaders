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

precision mediump float;

uniform sampler3D tex;
uniform sampler3D swizzleMask;
uniform int useSwizzleMask;
uniform float frame;
uniform float frameCount;
uniform vec2 blur;
uniform mat4 swizzleMatrix;
uniform int useSwizzle;
uniform float alpha;

const int range = 5;

varying vec2 fragTexCoord;

void main() {
	float first = floor(frame);
	float second = mod(ceil(frame), frameCount);
	float fade = frame - first;
	vec4 color;
	if(blur.x == 0.f && blur.y == 0.f)
	{
		if(fade != 0.f)
			color = mix(
				texture3D(tex, vec3(fragTexCoord, first)),
				texture3D(tex, vec3(fragTexCoord, second)), fade);
		else
			color = texture3D(tex, vec3(fragTexCoord, first));
	}
	else
	{
		color = vec4(0., 0., 0., 0.);
		const float divisor = float(range * (range + 2) + 1);
		for(float i = -range; i <= range; ++i)
		{
			float scale = float(range + 1 - abs(i)) / divisor;
			vec2 coord = fragTexCoord + blur * i / float(range);
			if(fade != 0.f)
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
			float factor = texture3D(swizzleMask, vec3(fragTexCoord, first)).r;
			color = color * factor + swizzleColor * (1.0 - factor);
		}
		else
			color = swizzleColor;
	}
	gl_FragColor = color * alpha;
}
