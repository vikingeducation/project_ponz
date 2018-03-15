hello;

{{#each currentUser.childIds as |ponzvert| }}
  <!-- <tr> -->
    <!-- <td>
      40 points: <strong>{{ponzvert.displayName}} </strong> <em>ponzverted on {{ponzvert.createdAt}}</em>
    </td> -->
    {{>referral ponzvert=ponzvert}}
  <!-- </tr> -->
  <tr>
    <!-- <td>
      <span class="tab">20 points: <strong>{{ponzvert.displayName}} </strong> <em>ponzverted on {{ponzvert.createdAt}}</em></span>
    </td> -->
  </tr>
{{/each }}


making a change


a - depth 0

aa - depth 1

aaa - depth 2


view for points


<div>
  {{#if currentUser.ponzPoints.length }}
    <table class="table">
      <tbody>
          <tr>
            <h3>Ponz Pointz {{currentUser.ponzPoints}}</h3>
          </tr>
      </tbody>
    </table>
  {{else }}
    <p class="text-danger">You have no Ponz Points yet. You're poor.</p>
  {{/if }}
</div>



ghetto hardcoded triangle

<div class='arrow-up'>{{#each pyramid}}
<p><font color='white'>{{this}}</font></p>

{{/each}}</div>
