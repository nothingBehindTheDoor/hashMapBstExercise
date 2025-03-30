class HashMap {
  loadFactor = 0.8;
  capacity = 16;
  size = 0;
  buckets;

  // this hash function was stolen from https://stackoverflow.com/a/52171480
  // it is great !!! in my amateur eyes.
  hash(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }

  constructor() {
    this.loadFactor = 0.8;
    this.capacity = 16;
    this.buckets = [];
    for (let i = 0; i < this.capacity; i++) {
      this.buckets.push([]);
    }
    this.size = 0;
  }

  set(key, value) {
    let hashCode = this.hash(key);
    let selectedBucket = this.buckets[hashCode % this.capacity];
    if (selectedBucket.length === 0) {
      selectedBucket[0] = { key: key, value: value, next: null };
      this.size++;
      return;
    }
    if (selectedBucket) {
      if (this.get(key)) {
        const target = this.#locateInBucket(key, selectedBucket);
        target.key = key;
        target.value = value;
      } else {
        selectedBucket = selectedBucket[0];
        while (selectedBucket.next) {
          selectedBucket = selectedBucket.next;
        }
        selectedBucket.next = { key: key, value: value, next: null };
        this.size++;
      }
    }

    if (this.size / this.capacity > this.loadFactor) {
      this.capacity *= 2;
      let tempBuckets = this.buckets.slice();
      this.buckets = [];
      for (let i = 0; i < this.capacity; i++) {
        this.buckets.push([]);
      }

      for (let i = 0; i < this.capacity / 2; i++) {
        console.log(this.capacity / 2);
        let bucket = tempBuckets[i];
        // console.log(i, bucket);
        if (!bucket) {
          console.log("no bucket");
        } else if (bucket.length !== 0) {
          let pointer = bucket[0];
          do {
            this.set(pointer.key, pointer.value);
            this.size--;
            pointer = pointer.next;
          } while (pointer);
        }
      }
    }
  }

  recurse(pointer) {
    if (pointer.next) {
      this.recurse(pointer.next);
    } else {
      return pointer;
    }
  }

  remove(key) {
    let toBeRemoved = this.get(key);
    let bucket = this.buckets[this.hash(key) % this.capacity];
    if (!toBeRemoved) return false;
    // this part searches through the individual buckets, checking for conditions
    // to remove the desired entry without disrupting the other possible entries.
    // if the first item is what we're searching for:
    if (bucket[0].key === key) {
      if (bucket[0].next === null) {
        this.buckets[this.hash(key) % this.capacity] = [];
      } else {
        bucket[0] = toBeRemoved.next;
      }
    } else {
      // otherwise search through the rest.
      let pointer = bucket[0];
      do {
        if (pointer.next.key === key) {
          pointer.next = toBeRemoved.next;
          this.size--;
          return true;
        }
        pointer = pointer.next;
      } while (pointer);
    }
    this.size--;
    return true;
  }

  entries() {
    let toBePrinted = "";
    for (let i = 0; i < this.capacity; i++) {
      let pointer = this.buckets[i];
      if (pointer[0]) {
        pointer = pointer[0];
        do {
          toBePrinted += `(${pointer.key}: ${pointer.value}) => `;
          pointer = pointer.next;
        } while (pointer);
      }
    }
    console.log(toBePrinted);
  }

  keys() {
    let toBePrinted = "";
    for (let i = 0; i < this.capacity; i++) {
      let pointer = this.buckets[i];
      if (pointer[0]) {
        pointer = pointer[0];
        do {
          toBePrinted += `(${pointer.key}) => `;
          pointer = pointer.next;
        } while (pointer);
      }
    }
    console.log(toBePrinted);
  }

  values() {
    let toBePrinted = "";
    for (let i = 0; i < this.capacity; i++) {
      let pointer = this.buckets[i];
      if (pointer[0]) {
        pointer = pointer[0];
        do {
          toBePrinted += `(${pointer.value}) => `;
          pointer = pointer.next;
        } while (pointer);
      }
    }
    console.log(toBePrinted);
  }

  values() {
    let toBePrinted = "";
    for (let i = 0; i < this.capacity; i++) {
      let pointer = this.buckets[i];
      if (pointer[0]) {
        pointer = pointer[0];
        let num = 0;
        do {
          num++;
          pointer = pointer.next;
        } while (pointer);
        toBePrinted += `/ ${num} /`
      }
    }
    console.log(toBePrinted);
  }

  get(key) {
    let pointer = this.buckets[this.hash(key) % this.capacity];
    if (!pointer[0]) return false;
    if (pointer[0].key === key) return pointer[0];
    if (pointer[0]) {
      pointer = pointer[0];
      do {
        if (pointer.key === key) return pointer;
        pointer = pointer.next;
      } while (pointer);
    }
    return null;
  }

  #locateInBucket(key, bucket) {
    let pointer = bucket;
    if (pointer[0]) {
      pointer = pointer[0];
      do {
        if (pointer.key === key) return pointer;
        pointer = pointer.next;
      } while (pointer);
    }
    return null;
  }

  collisionsPerEntry() {
    let collisionCount = 0;
    for (let i = 0; i < this.capacity; i++) {
      let pointer = this.buckets[i];
      if (pointer[0]) {
        pointer = pointer[0];
        let repcount = 0;
        do {
          repcount++;
          pointer = pointer.next;
        } while (pointer);
        collisionCount += (repcount - 1);
      }
    }
    return collisionCount / this.size;
  }
}

const hashM = new HashMap();

// for (let i = 1; i <= 1000; i++) {
//   hashM.set(i.toString(), "next");
// }
const wordArr1000 = ["the", "and", "to", "of", "a", "I", "in", "was", "he", "that", "it", "his", "her", "you", "as", "had", "with", "for", "she", "not", "at", "but", "be", "my", "on", "have", "him", "is", "said", "me", "which", "by", "so", "this", "all", "from", "they", "no", "were", "if", "would", "or", "when", "what", "there", "been", "one", "could", "very", "an", "who", "them", "Mr", "we", "now", "more", "out", "do", "are", "up", "their", "your", "will", "little", "than", "then", "some", "into", "any", "well", "much", "about", "time", "know", "should", "man", "did", "like", "upon", "such", "never", "only", "good", "how", "before", "other", "see", "must", "am", "own", "come", "down", "say", "after", "think", "made", "might", "being", "Mrs", "again", "great", "two", "can", "go", "over", "too", "here", "came", "old", "thought", "himself", "where", "our", "may", "first", "way", "has", "though", "without", "went", "us", "away", "day", "make", "these", "young", "nothing", "long", "shall", "sir", "back", "house", "ever", "yet", "take", "every", "hand", "most", "last", "eyes", "its", "miss", "having", "off", "looked", "even", "while", "dear", "look", "many", "life", "still", "mind", "quite", "another", "those", "just", "head", "tell", "better", "always", "saw", "seemed", "put", "face", "let", "took", "poor", "place", "why", "done", "herself", "found", "through", "same"]
for (const word of wordArr1000) {
  hashM.set(word, "my");
}
// hashM.set("maia", "wilson");
// hashM.set("joanne", "park");
// hashM.set("maia", "wilkington");
// hashM.set("1", "hello");
// hashM.set("17", "hi");

// .load HashMap.js
