/* outline.frag
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

precision mediump float;

uniform sampler3D tex;
uniform float frame;
uniform float frameCount;
uniform vec4 color;
uniform vec2 off;

varying vec2 fragTexCoord;

// Stubbed out because the vanilla version didn't fit within 32 or even 64 registers lol.

void main() {
	float first = (floor(frame) + .5f) / frameCount + off.x * .000001;
	float second = (mod(ceil(frame), frameCount) + .5f) / frameCount;
	float fade = (frame + .5f) / frameCount - first;
	vec4 spriteColor;
	if(fade != 0.f)
		spriteColor = mix(
			texture3D(tex, vec3(fragTexCoord, first)),
			texture3D(tex, vec3(fragTexCoord, second)), fade);
	else
		spriteColor = texture3D(tex, vec3(fragTexCoord, first));
	gl_FragColor = color * vec4(vec3((spriteColor.r + spriteColor.g + spriteColor.b) / 3), spriteColor.a);
}
