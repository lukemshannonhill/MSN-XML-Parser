
class Tag {
	constructor(name, binding) {
		this.name = name;
		this.binding = binding || null;
	}
	toString() {
		return this.name;
	}
}
exports = Tag;