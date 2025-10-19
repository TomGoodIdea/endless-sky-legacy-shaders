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

precision mediump float;

uniform sampler3D tex;
uniform float frame;
uniform float frameCount;
uniform vec4 color;
uniform vec2 off;

varying vec2 fragTexCoord;

// Stubbed out because the vanilla version didn't fit within 32 or even 64 registers lol.

void main() {
	float first = floor(frame) + off.x;
	float second = mod(ceil(frame), frameCount);
	float fade = frame - first;
	float sum = mix(first, second, fade);
	gl_FragColor = color * sqrt(sum) * texture3D(tex, vec3(fragTexCoord, first));
}
